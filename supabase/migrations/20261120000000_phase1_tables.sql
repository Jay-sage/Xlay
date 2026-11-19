-- ============================================================
-- Phase 1: Xlay data model
-- ============================================================

-- Enable citext for case-insensitive username comparisons
create extension if not exists citext with schema extensions;

-- ============================================================
-- ENUM TYPES
-- ============================================================

create type public.avatar_source as enum ('bitmoji', 'upload', 'xlay_avatar');
create type public.invite_status as enum ('pending', 'accepted', 'declined', 'revoked');

-- ============================================================
-- PROFILES
-- ============================================================

create table public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  snap_external_id  text unique not null,
  username          extensions.citext unique,
  display_name      text not null default '',
  avatar_url        text,
  avatar_source     public.avatar_source not null default 'bitmoji',
  bio               text,
  theme_id          text not null default 'midnight',
  accent_color      text,
  bg_type           text not null default 'solid',
  bg_url            text,
  music_url         text,
  music_title       text,
  streak_count      integer not null default 0 check (streak_count >= 0),
  snap_score        integer not null default 0 check (snap_score >= 0),
  show_streak       boolean not null default false,
  show_score        boolean not null default false,
  show_views        boolean not null default false,
  is_private        boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint username_format check (
    username is null or (
      length(username::text) >= 3 and
      length(username::text) <= 20 and
      username::text ~ '^[a-zA-Z0-9_]+$'
    )
  )
);

-- Username cannot match reserved_usernames (case-insensitive)
create or replace function public.username_is_not_reserved()
returns trigger language plpgsql security definer as $$
begin
  if exists (
    select 1 from public.reserved_usernames
    where lower(username) = lower(new.username::text)
  ) then
    raise exception 'username_reserved';
  end if;
  return new;
end;
$$;

create trigger trg_profiles_no_reserved_username
  before insert or update of username on public.profiles
  for each row when (new.username is not null)
  execute function public.username_is_not_reserved();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;

-- Public read: non-private profiles
create policy "profiles_public_read"
  on public.profiles for select
  using (not is_private);

-- Owner full access
create policy "profiles_owner_all"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- LINKS
-- ============================================================

create table public.links (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  platform    text not null default 'custom',
  url         text not null,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index links_profile_id_idx on public.links(profile_id);

alter table public.links enable row level security;

-- Public read: active links on non-private profiles
create policy "links_public_read"
  on public.links for select
  using (
    is_active = true and
    exists (
      select 1 from public.profiles p
      where p.id = profile_id and not p.is_private
    )
  );

-- Owner full access
create policy "links_owner_all"
  on public.links for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- ============================================================
-- BEST FRIEND INVITES
-- ============================================================

create table public.best_friend_invites (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null references public.profiles(id) on delete cascade,
  token             text unique not null default encode(gen_random_bytes(24), 'base64url'),
  status            public.invite_status not null default 'pending',
  friend_profile_id uuid references public.profiles(id) on delete set null,
  created_at        timestamptz not null default now(),
  accepted_at       timestamptz
);

create index bfi_owner_id_idx on public.best_friend_invites(owner_id);
create index bfi_token_idx on public.best_friend_invites(token);

-- Enforce max 3 accepted friends per owner via trigger
create or replace function public.enforce_max_friends()
returns trigger language plpgsql security definer as $$
begin
  if new.status = 'accepted' then
    if (
      select count(*)
      from public.best_friend_invites
      where owner_id = new.owner_id and status = 'accepted' and id != new.id
    ) >= 3 then
      raise exception 'max_friends_exceeded';
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_bfi_max_friends
  before insert or update of status on public.best_friend_invites
  for each row execute function public.enforce_max_friends();

alter table public.best_friend_invites enable row level security;

-- Owner can read/create/update/delete their invites
create policy "bfi_owner_all"
  on public.best_friend_invites for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Friend can read and update status (accept/decline/revoke) on invites for them
create policy "bfi_friend_read"
  on public.best_friend_invites for select
  using (auth.uid() = friend_profile_id);

create policy "bfi_friend_update_status"
  on public.best_friend_invites for update
  using (auth.uid() = friend_profile_id)
  with check (auth.uid() = friend_profile_id and status in ('accepted', 'declined', 'revoked'));

-- Anyone can read a pending invite by token (to show the accept page)
create policy "bfi_public_pending_read"
  on public.best_friend_invites for select
  using (status = 'pending');

-- ============================================================
-- CARD VIEWS
-- ============================================================

create table public.card_views (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null,  -- no FK for insert speed
  source        text not null default 'direct',
  device        text not null default 'unknown',
  country       text,
  visitor_hash  text not null,
  created_at    timestamptz not null default now()
);

-- Partial index for unique-visitor deduplication queries
create index cv_profile_hash_time_idx
  on public.card_views(profile_id, visitor_hash, created_at desc);

alter table public.card_views enable row level security;

-- Anyone (anon) can insert a view (view logging)
create policy "card_views_insert_open"
  on public.card_views for insert
  with check (true);

-- Profile owner can read their own views
create policy "card_views_owner_read"
  on public.card_views for select
  using (
    auth.uid() is not null and
    exists (
      select 1 from public.profiles p
      where p.id = profile_id and p.id = auth.uid()
    )
  );

-- ============================================================
-- LINK CLICKS
-- ============================================================

create table public.link_clicks (
  id         uuid primary key default gen_random_uuid(),
  link_id    uuid not null,  -- no FK for insert speed
  source     text not null default 'direct',
  created_at timestamptz not null default now()
);

create index lc_link_id_idx on public.link_clicks(link_id);

alter table public.link_clicks enable row level security;

-- Anyone can insert a click
create policy "link_clicks_insert_open"
  on public.link_clicks for insert
  with check (true);

-- Link owner can read clicks on their links
create policy "link_clicks_owner_read"
  on public.link_clicks for select
  using (
    auth.uid() is not null and
    exists (
      select 1 from public.links l
      where l.id = link_id and l.profile_id = auth.uid()
    )
  );

-- ============================================================
-- PUBLIC CARD VIEW (safe, filtered)
-- ============================================================

create or replace function public.get_public_card(p_username text)
returns json language plpgsql security definer as $$
declare
  v_profile public.profiles;
  v_result  json;
begin
  select * into v_profile
  from public.profiles
  where username = p_username::extensions.citext
    and not is_private
  limit 1;

  if not found then
    return null;
  end if;

  select json_build_object(
    'id',           v_profile.id,
    'username',     v_profile.username,
    'display_name', v_profile.display_name,
    'avatar_url',   v_profile.avatar_url,
    'avatar_source',v_profile.avatar_source,
    'bio',          v_profile.bio,
    'theme_id',     v_profile.theme_id,
    'accent_color', v_profile.accent_color,
    'bg_type',      v_profile.bg_type,
    'bg_url',       v_profile.bg_url,
    'music_url',    v_profile.music_url,
    'music_title',  v_profile.music_title,
    'streak_count', case when v_profile.show_streak then v_profile.streak_count else null end,
    'snap_score',   case when v_profile.show_score  then v_profile.snap_score   else null end,
    'show_views',   v_profile.show_views,
    'links', (
      select json_agg(json_build_object(
        'id',       l.id,
        'platform', l.platform,
        'url',      l.url,
        'sort_order', l.sort_order
      ) order by l.sort_order)
      from public.links l
      where l.profile_id = v_profile.id and l.is_active = true
    ),
    'best_friends', (
      select json_agg(json_build_object(
        'username',     fp.username,
        'display_name', fp.display_name,
        'avatar_url',   fp.avatar_url,
        'avatar_source',fp.avatar_source
      ))
      from public.best_friend_invites bfi
      join public.profiles fp on fp.id = bfi.friend_profile_id
      where bfi.owner_id = v_profile.id and bfi.status = 'accepted'
    )
  ) into v_result;

  return v_result;
end;
$$;

-- ============================================================
-- STORAGE BUCKETS (created via API, documented here)
-- ============================================================
-- Bucket: 'music'  - max 10MB, audio/mpeg only, public URLs
-- Bucket: 'avatars'- max 2MB, image/*, public URLs
-- Both require RLS policies for authenticated upload and public read.

-- View count helper (called from app)
create or replace function public.get_view_count(p_profile_id uuid)
returns bigint language sql security definer as $$
  select count(*)::bigint
  from public.card_views
  where profile_id = p_profile_id;
$$;
