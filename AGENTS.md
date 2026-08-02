# Tekakonik — Rules & Guardrails for AI Agents

## Core Principles & Visual Identity (Modern Comic)
- **Primary Characters**: 
  - **Kapten Klu**: Detective superhero who gives 100% HONEST clues. Identity color: `#2B6CFF` (Electric Blue).
  - **Bayangan**: Rival trickster who gives MISLEADING/FUNNY clues. Identity color: `#FF3D81` (Magenta).
- **Fonts**:
  - Title/Header/Burst Text: Google Fonts `Bangers` or `Archivo Black`. ONLY for titles, numbers, and feedback bursts.
  - Body/Paragraphs/Labels: `Plus Jakarta Sans`.
- **Colors**:
  - Ink: `#16161A` (Outlines, borders, key text).
  - Paper: `#FAF7F0` (Background).
  - Green Vivid: `#22C55E` (Correct feedback).
  - Red-Orange: `#F5402C` (Wrong feedback).
- **Borders & Shadows**:
  - Thick solid borders: 3px - 4px `#16161A` with small border radii (4px - 8px). NEVER round-2xl or zero-border.
  - Sticker Shadows: Hard offset box shadows (`box-shadow: 4px 4px 0 #16161A`). NEVER soft blurred shadows.
  - Halftone dot texture patterns for comic feel.

## Technical Guardrails
1. **Security & Word Leaks**:
   - `Word.text` MUST NEVER be sent to the client frontend before the game session is solved/completed.
   - All guess evaluation occurs server-side in API routes (`/api/game/guess`). Return ONLY status arrays (`"CORRECT"`, `"PRESENT"`, `"ABSENT"`).
2. **Mobile First & Responsive**:
   - Build all screens & components for 375px mobile viewport FIRST.
   - Use Tailwind responsive prefixes (`md:`, `lg:`, `xl:`) within the SAME file/component. NEVER duplicate files for desktop vs mobile.
   - Desktop layout (lg+): Use 2-column layout separated by thick black comic gutter lines.
   - Touch targets: Minimum 44x44px per virtual keyboard button.
   - Use `100dvh` for full screen heights.
3. **App Router & Suspense**:
   - Any component utilizing `useSearchParams()` MUST be wrapped in a `<Suspense>` boundary.
4. **CSS & Styling Rules**:
   - Avoid CSS `inset` shorthand. Specify `top`, `right`, `bottom`, `left` explicitly.
   - Do NOT override default Tailwind `--spacing-*` tokens dynamically to prevent class collisions.
   - For modals/drawers, backdrop filters create new stacking contexts; use React Portals or fixed overlays cleanly.
5. **Auth & Sessions**:
   - NextAuth v5 configuration MUST include `trustHost: true`.
   - Support seamless guest gameplay with anonymous session IDs stored in `localStorage`.
6. **Animations & Web Speech API**:
   - 3D card flips for guess letters, screen shake on wrong guesses, halftone bursts on win.
   - Web Speech API fallback: Always provide "Tampilkan sebagai Teks" for iOS Safari audio failures in Hardcore Voice Mode.

## Data Schema Summary
- Models: `User`, `Chapter`, `Word`, `GameSession`, `DuelChallenge`, `WordSuggestion`, `Announcement`, `FeatureFlag`.
- Refer to `prisma/schema.prisma` for relations and field specs.
