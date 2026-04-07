# Mobile Optimization

## Summary

The site currently renders poorly on mobile devices. A responsive design pass is needed to ensure all pages are usable on small screens.

## Motivation

The target audience (18-30, tech) primarily browses on mobile. The platform already has a mobile menu (hamburger nav), but page content, forms, and group cards need responsive adjustments.

## Areas to audit

- **Group detail page**: management section, member list, check-in form, meeting log
- **Profile page**: availability grid (7×3 grid likely overflows on small screens), skill list, delete account section
- **Search page**: filter inputs, group cards, CTA placement
- **Create group page**: form layout, optional fields accordion
- **Legal pages**: text readability on narrow viewports
- **Landing page**: hero section, step cards

## Approach

1. Audit every page at 375px width (iPhone SE) and 390px (iPhone 14)
2. Fix layout issues with Tailwind responsive utilities
3. Consider touch target sizes (min 44×44px for interactive elements)
4. Combine with accessibility fixes from PageSpeed Insights (contrast, aria attributes)

## Reference

- Current PageSpeed scores: Performance 100, Accessibility 93, Best Practices 100, SEO 100
- URL: synedria.vercel.app
