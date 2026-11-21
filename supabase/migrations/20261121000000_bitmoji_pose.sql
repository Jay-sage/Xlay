-- Add avatar_pose to profiles for full-body 3D Bitmoji pose selection
alter table public.profiles
  add column if not exists avatar_pose text not null default '10221961';

-- Update get_public_card to include avatar_pose
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
    'avatar_pose',  v_profile.avatar_pose,
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
      select coalesce(json_agg(json_build_object(
        'id',       l.id,
        'platform', l.platform,
        'url',      l.url,
        'sort_order', l.sort_order
      ) order by l.sort_order), '[]'::json)
      from public.links l
      where l.profile_id = v_profile.id and l.is_active = true
    ),
    'best_friends', (
      select coalesce(json_agg(json_build_object(
        'username',     fp.username,
        'display_name', fp.display_name,
        'avatar_url',   fp.avatar_url,
        'avatar_source',fp.avatar_source
      )), '[]'::json)
      from public.best_friend_invites bfi
      join public.profiles fp on fp.id = bfi.friend_profile_id
      where bfi.owner_id = v_profile.id and bfi.status = 'accepted'
    )
  ) into v_result;

  return v_result;
end;
$$;
