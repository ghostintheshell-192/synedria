-- The group objective may be derived from the linked certification instead of
-- typed (mirrors the derived-title rule, FR-10a/FR-10). When a group targets a
-- certification, "prepare for certification X" is implied by certification_id
-- and shown as a read-only derived line — it is NOT stored in objective.
-- objective therefore becomes nullable, holding only the user's own free text.
--
-- A group must still always express a goal: a custom objective OR a linked
-- certification. The only forbidden state is neither — the same shape as the
-- title CHECK added in 00008.
ALTER TABLE groups
  ALTER COLUMN objective DROP NOT NULL;

ALTER TABLE groups
  ADD CONSTRAINT groups_objective_or_certification
  CHECK (objective IS NOT NULL OR certification_id IS NOT NULL);
