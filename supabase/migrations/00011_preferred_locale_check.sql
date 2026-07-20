-- Constrain preferred_locale to the locales the app actually serves.
--
-- The column is user-writable: the profiles UPDATE policy lets anyone write
-- their own row, and PostgREST is reachable without going through our form. The
-- value then flows into the redirect URL built by the OAuth callback
-- (`${origin}/${redirectLocale}`), so leaving it as unconstrained text means
-- revisiting that question every time someone touches the callback.
--
-- A CHECK rather than an enum: the authoritative list lives in
-- src/i18n/routing.ts and grows as an ordinary product decision, whereas enum
-- values cannot be removed without recreating the type and converting every
-- column that uses it.
--
-- NULL stays valid and means "no preference — follow the browser", which is the
-- state of every profile that predates this constraint.

ALTER TABLE profiles
  ADD CONSTRAINT profiles_preferred_locale_valid
  CHECK (preferred_locale IS NULL OR preferred_locale IN ('it', 'en'));
