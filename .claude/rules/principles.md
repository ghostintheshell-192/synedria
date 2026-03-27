# Development Principles

Core principles that apply to ALL coding work on this project.

---

## Core Philosophy

- **Functional minimalism**: Implement the minimum complexity necessary for current requirements
- **Incrementality**: Test each change before proceeding, implement one component at a time
- **Effective simplicity**: Prefer the simplest solution that works
- **Reversibility**: Return to working versions when optimizations compromise functionality

## Product Philosophy

- Every feature must **reduce friction toward physical meetings** or make existing groups healthier
- If a feature does neither, it doesn't belong
- **Small is better**: Groups of 2-5, not communities of 500
- Reputation emerges from visible activity, never from explicit judgments

## Critical Approach

- Critically evaluate and question questionable assumptions
- For ambiguous questions: identify the unclear part and ask for direct clarification
- Do not develop elaborate explanations for possible interpretations of the question

---

## Development Workflow

When developing code or debugging, always follow these general rules:

1. **Development**: Work on one bug, feature, or thematically coherent development at a time
2. **Build**: Verify the project builds without errors
3. **User Testing**: Let the user test the changes from her perspective
4. **Atomic Commit**: Create a single, focused commit for the completed work

---

## Technology Compatibility

- Verify complete compatibility between proposed frameworks and libraries
- Explicitly list compatibility requirements before suggesting any library
- Confirm active support for third-party libraries with recent framework versions
- Report potential integration problems before implementation

---

## Security First

- **Row Level Security**: Every Supabase table must have RLS enabled
- **Auth validation**: Always verify user identity server-side, never trust client-only checks
- **No secrets in client code**: Environment variables prefixed with `NEXT_PUBLIC_` are public
- **Input validation**: Validate at system boundaries (API routes, form submissions)
- **No user data in SEO**: User profiles are never indexable
