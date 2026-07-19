---
type: code-quality
priority: low
status: open
discovered: 2026-07-19
related: []
related_decision: null
---

# Onboarding profile-completion copy needs improvement

## Description

The profile-completion prompt shown on the logged-in dashboard uses copy that
should be reworked. Current strings (`messages/it.json`, `onboarding` namespace):

- `title`: "Completa il tuo profilo"
- `description`: "Così potrai essere trovato da chi studia le tue stesse cose."

Flagged by Valentina while testing the logged-in area for the first time.

## Impact

This is the **first message a user sees** inside their reserved area, so the
copy carries onboarding weight. Two concerns:

1. Tone/clarity — the phrasing can be sharpened (Valentina's note).
2. **Gendered participle** (my observation): "trovato" is masculine, but the
   prompt is shown to users of any gender (e.g. the test user Aurora). Italian
   forces a gender on the participle here; the English string (`en.json`) does
   not have this problem, so only the IT copy needs the gender-neutral rework.

## Proposed Solution

Rewrite the IT `description` to avoid the gendered participle — e.g. shift the
subject so the user is the object of the verb ("Così chi studia le tue stesse
cose potrà trovarti") or an equivalent neutral phrasing. Review `title` and
`en.json` for parity while at it. No behaviour change — copy only.

## Notes

Low priority: cosmetic, no functional impact. Good candidate to bundle with a
broader onboarding-copy pass rather than a one-line fix.
