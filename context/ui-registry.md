# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Homepage composition

- File: [components/homepage/Homepage.tsx](components/homepage/Homepage.tsx)
- Supporting files: [components/homepage/HomepageHeader.tsx](components/homepage/HomepageHeader.tsx), [components/homepage/HomepageHero.tsx](components/homepage/HomepageHero.tsx), [components/homepage/HomepagePreview.tsx](components/homepage/HomepagePreview.tsx), [components/homepage/HomepageFeatureSplit.tsx](components/homepage/HomepageFeatureSplit.tsx), [components/homepage/HomepageConfidenceSplit.tsx](components/homepage/HomepageConfidenceSplit.tsx), [components/homepage/HomepageTestimonial.tsx](components/homepage/HomepageTestimonial.tsx), [components/homepage/HomepageCta.tsx](components/homepage/HomepageCta.tsx), [components/homepage/HomepageFooter.tsx](components/homepage/HomepageFooter.tsx), [components/homepage/HomepageButton.tsx](components/homepage/HomepageButton.tsx)
- Shared content: [components/homepage/homepage-content.tsx](components/homepage/homepage-content.tsx)
- Patterns: centered hero copy, dual-column content bands, white cards on `bg-background`, gradient accent glow, public image embeds from `public/images/`
