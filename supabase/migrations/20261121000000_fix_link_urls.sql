-- ============================================================
-- FIX 1 — Normalise existing outbound link URLs
--
-- Links were saved as free text ("Sage.com"), which the browser
-- resolves as a RELATIVE url (xlay.me/Sage.com) instead of a link to
-- sage.com. This migration prefixes a scheme to any row that does not
-- already have one.
--
-- Rows that already start with http:// or https:// are left untouched.
--
-- RUN ORDER:
--   1. Back up the database.
--   2. Run the COUNT query below to see how many rows are affected.
--   3. Run the UPDATE.
-- ============================================================

-- ---- STEP 1: COUNT the affected rows (read-only, safe to run first) ----
select count(*) as links_missing_scheme
from public.links
where url not like 'http://%'
  and url not like 'https://%';

-- ---- STEP 2: Preview the rows that will change (optional) ----
select id, url
from public.links
where url not like 'http://%'
  and url not like 'https://%'
order by created_at;

-- ---- STEP 3: Apply the fix ----
-- Only rows with no scheme are touched. The 'http://'|| style below is
-- deliberately not used here: we use concat() with a literal 'https://'
-- so every affected link becomes a secure URL.
update public.links
set url = 'https://' || url
where url not like 'http://%'
  and url not like 'https://%';

-- ---- STEP 4: Verify ----
select count(*) as links_still_missing_scheme
from public.links
where url not like 'http://%'
  and url not like 'https://%';
