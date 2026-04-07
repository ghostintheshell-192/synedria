# Back Navigation

## Summary

Add a "← Back" button at the top of internal pages to improve navigation flow, especially after actions like closing or leaving a group.

## Motivation

After performing actions (close group, leave group, save profile), users often land on a page with no obvious way to go back. The browser back button works but isn't always reliable (e.g., after redirects). A visible back link improves discoverability and reduces friction.

## Pages affected

- Group detail (`/groups/[slug]`) → back to search or my-groups
- Profile (`/profile`) → back to dashboard
- Create group (`/groups/create`) → back to my-groups or search
- Join group (`/groups/[slug]/join`) → back to group page

## Design considerations

- Use a simple text link with arrow: "← Cerca gruppi" / "← I miei gruppi"
- Positioned above the page title
- The destination should be contextual (where the user came from) or default to a sensible page
- Consider using `router.back()` vs explicit links — `router.back()` is unreliable if user arrived from external link
