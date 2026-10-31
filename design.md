# Scenova Design System

> **Purpose:** The source of truth for Scenova’s visual language and UI implementation.
>
> **Product:** Scenova — an AI-powered ad-video generator that turns uploaded product photos into polished video advertisements.
>
> **Status:** Derived from the current global CSS tokens and utilities supplied for Scenova. Where a token is referenced by the CSS but not defined there, it is marked as an unresolved token rather than assigned an invented value.

---

## 1. Design principles

Scenova should feel like a premium, approachable creative workspace: clean enough for focused editing, expressive enough for a creative product, and predictable enough for a production tool.

1. **Clarity before decoration.** Use hierarchy, spacing, and typography to explain the interface. Avoid adding visual effects without a clear purpose.
2. **Light-first, dark-supported.** The default theme is a near-white canvas with dark text and a vivid green accent. Dark mode is supported by a dedicated `.dark` token set.
3. **One clear primary action.** Give each screen or panel a visually dominant action, such as creating an ad, generating a scene, or exporting a video.
4. **Motion communicates state.** Use animation to clarify entry, progress, feedback, and interaction—not as constant decoration.
5. **Respect creative work.** Keep the storyboard, preview, scene controls, and generation status easy to scan. Do not let gradients, glass effects, or oversized radii compete with the video content.
6. **Accessible by default.** Preserve visible focus, readable contrast, and reduced-motion support.

## 2. Technology and styling

- **Framework:** TanStack Start + React
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Animation:** Motion for React
- **CSS imports:**
  ```css
  @import 'tailwindcss';
  @import 'tw-animate-css';
  @import 'shadcn/tailwind.css';
  ```
- **Dark variant:**
  ```css
  @custom-variant dark (&:is(.dark *));
  ```

Prefer Tailwind utilities and existing design tokens over one-off CSS. Use custom CSS when it represents a reusable primitive or behavior that is awkward to express with utilities.

## 3. Brand and visual identity

### Brand character

- Premium and modern
- Creative, but not visually noisy
- Friendly and direct
- Precise and tool-oriented
- Suitable for both first-time creators and experienced marketers

### Accent color

The primary brand accent is a vivid, mint-leaning green:

```css
--primary: oklch(0.8545 0.1675 159.6564);
```

Use it for primary actions, active states, focus rings, selected indicators, and restrained data visualization. The primary foreground is black, which suits the light accent color.

The supplied stylesheet also contains violet glow and violet selection treatments. These are **secondary effects**, not a replacement for the green brand accent. Use violet sparingly and consistently; do not introduce violet as a competing primary-action color.

## 4. Color tokens

The values below are copied from the supplied CSS. Keep these CSS custom properties as the canonical source; do not duplicate their raw values throughout components.

### 4.1 Light theme (`:root`)

| Token | Value | Intended use |
|---|---|---|
| `--background` | `oklch(0.994 0 0)` | Main app canvas |
| `--foreground` | `oklch(0 0 0)` | Main text |
| `--card` | `oklch(0.994 0 0)` | Cards and elevated content surfaces |
| `--card-foreground` | `oklch(0 0 0)` | Text on cards |
| `--popover` | `oklch(0.9911 0 0)` | Popovers and floating surfaces |
| `--popover-foreground` | `oklch(0 0 0)` | Text in popovers |
| `--primary` | `oklch(0.8545 0.1675 159.6564)` | Main brand action and emphasis |
| `--primary-foreground` | `oklch(0 0 0)` | Text/icons on primary |
| `--secondary` | `oklch(0.9933 0.0011 197.139)` | Secondary surfaces |
| `--secondary-foreground` | `oklch(0.1344 0 0)` | Text on secondary |
| `--muted` | `oklch(0.9702 0 0)` | Quiet surfaces and disabled-like backgrounds |
| `--muted-foreground` | `oklch(0.4386 0 0)` | Secondary text |
| `--accent` | `oklch(0.9947 0.0074 164.9465)` | Subtle highlighted surfaces |
| `--accent-foreground` | `oklch(0.6184 0.1489 155.4444)` | Text/icons on accent surfaces |
| `--destructive` | `oklch(0.6665 0.2111 2.8306)` | Destructive actions and error emphasis |
| `--destructive-foreground` | `oklch(1 0 0)` | Text on destructive actions |
| `--border` | `oklch(0.9722 0.0034 247.8581)` | Default borders |
| `--input` | `oklch(0.9401 0 0)` | Input borders/surfaces |
| `--ring` | `oklch(0.8545 0.1675 159.6564)` | Keyboard focus ring |
| `--chart-1` | `oklch(0.8545 0.1675 159.6564)` | Chart series 1 |
| `--chart-2` | `oklch(0.8979 0.1884 146.5522)` | Chart series 2 |
| `--chart-3` | `oklch(0.6658 0.2215 29.2981)` | Chart series 3 |
| `--chart-4` | `oklch(0.7507 0.1401 230.8266)` | Chart series 4 |
| `--chart-5` | `oklch(0.8257 0.1067 48.5116)` | Chart series 5 |
| `--sidebar` | `oklch(1 0 0)` | Sidebar background |
| `--sidebar-foreground` | `oklch(0 0 0)` | Sidebar text |
| `--sidebar-primary` | `oklch(0 0 0)` | Sidebar primary control |
| `--sidebar-primary-foreground` | `oklch(1 0 0)` | Text on sidebar primary |
| `--sidebar-accent` | `oklch(0.9752 0.0307 168.3924)` | Sidebar selected/hovered surface |
| `--sidebar-accent-foreground` | `oklch(0 0 0)` | Text on sidebar accent |
| `--sidebar-border` | `oklch(0.9401 0 0)` | Sidebar separators |
| `--sidebar-ring` | `oklch(0 0 0)` | Sidebar focus ring |

### 4.2 Dark theme (`.dark`)

Dark mode uses a black page background, charcoal cards, pale foreground text, and the same green brand accent.

| Token | Value | Intended use |
|---|---|---|
| `--background` | `oklch(0 0 0)` | Main app canvas |
| `--foreground` | `oklch(0.9551 0 0)` | Main text |
| `--card` | `oklch(0.1448 0 0)` | Cards and panels |
| `--card-foreground` | `oklch(0.9551 0 0)` | Text on cards |
| `--popover` | `oklch(0.221 0.0015 197.0452)` | Floating surfaces |
| `--popover-foreground` | `oklch(0.9551 0 0)` | Popover text |
| `--primary` | `oklch(0.8545 0.1675 159.6564)` | Main brand action |
| `--primary-foreground` | `oklch(0 0 0)` | Text on primary |
| `--secondary` | `oklch(0.47 0.09 160.0079)` | Secondary surfaces |
| `--secondary-foreground` | `oklch(0.9551 0 0)` | Text on secondary |
| `--muted` | `oklch(0.2653 0.0037 286.1465)` | Quiet surfaces |
| `--muted-foreground` | `oklch(0.6731 0 0)` | Secondary text |
| `--accent` | `oklch(0.3004 0.0609 159.8938)` | Highlighted surfaces |
| `--accent-foreground` | `oklch(0.997 0 0)` | Text on accent |
| `--destructive` | `oklch(0.7425 0.1696 1.0847)` | Destructive actions |
| `--destructive-foreground` | `oklch(1 0 0)` | Text on destructive |
| `--border` | `oklch(0.2138 0.0019 286.2347)` | Default borders |
| `--input` | `oklch(0.3523 0 0)` | Input borders/surfaces |
| `--ring` | `oklch(0.8545 0.1675 159.6564)` | Focus ring |
| `--chart-1` | `oklch(0.8545 0.1675 159.6564)` | Chart series 1 |
| `--chart-2` | `oklch(0.9173 0.1562 144.8458)` | Chart series 2 |
| `--chart-3` | `oklch(0.8531 0.0883 357.425)` | Chart series 3 |
| `--chart-4` | `oklch(0.8104 0.1216 228.4326)` | Chart series 4 |
| `--chart-5` | `oklch(0.8257 0.1067 48.5116)` | Chart series 5 |
| `--sidebar` | `oklch(0.1448 0 0)` | Sidebar background |
| `--sidebar-foreground` | `oklch(0.9551 0 0)` | Sidebar text |
| `--sidebar-primary` | `oklch(0.8545 0.1675 159.6564)` | Sidebar primary action |
| `--sidebar-primary-foreground` | `oklch(1 0 0)` | Text on sidebar primary |
| `--sidebar-accent` | `oklch(0.2824 0.0678 156.5634)` | Sidebar selected surface |
| `--sidebar-accent-foreground` | `oklch(0.8545 0.1675 159.6564)` | Selected sidebar text/icon |
| `--sidebar-border` | `oklch(0.3452 0.0098 241.941)` | Sidebar separators |
| `--sidebar-ring` | `oklch(0.8545 0.1675 159.6564)` | Sidebar focus ring |

The dark theme also repeats the font, radius, and shadow tokens from the light theme.

### 4.3 Token mapping

The `@theme inline` block maps semantic CSS variables to Tailwind color utilities, including:

- `bg-background`, `text-foreground`
- `bg-card`, `text-card-foreground`
- `bg-popover`, `text-popover-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-secondary`, `text-secondary-foreground`
- `bg-muted`, `text-muted-foreground`
- `bg-accent`, `text-accent-foreground`
- `bg-destructive`, `text-destructive-foreground`
- `border-border`, `border-input`, `ring-ring`
- `bg-sidebar`, `text-sidebar-foreground`, and related sidebar utilities
- `bg-chart-1` through `bg-chart-5`

Use semantic tokens instead of hard-coded color classes when the color represents a design-system role.

## 5. Typography

### Font families

| Token | Font |
|---|---|
| `--font-sans` | `Plus Jakarta Sans, sans-serif` |
| `--font-serif` | `Lora, serif` |
| `--font-mono` | `IBM Plex Mono, monospace` |

### Usage guidance

- **Plus Jakarta Sans:** primary UI, navigation, labels, buttons, headings, body copy, forms, and marketing content.
- **Lora:** occasional editorial emphasis only; do not use it as the default application UI font.
- **IBM Plex Mono:** technical metadata, IDs, model names, generation settings, timestamps, and code-like values where a monospaced style improves scanning.

The stylesheet establishes font families but does **not** define a complete type scale. Avoid assuming that `--text-body` and `--text-body--line-height` exist: they are referenced by `body` but are not defined in the supplied CSS. Define these tokens or replace the references with explicit, existing Tailwind typography utilities before relying on them.

Recommended hierarchy (implementation guidance, not existing CSS tokens):

- Page title: bold, prominent, concise
- Section title: medium-to-bold, clearly subordinate to page title
- Body: comfortable reading size and line height
- Supporting metadata: smaller and muted, but still readable
- Avoid using many font sizes within one compact panel

## 6. Shape, spacing, and elevation

### Radius

```css
--radius: 1.4rem;
--radius-sm: calc(var(--radius) - 4px);
--radius-md: calc(var(--radius) - 2px);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) + 4px);
```

The supplied base radius is generous. Use the semantic radius tokens consistently, but keep dense data tables, small controls, and compact utility elements visually tighter than large cards. Do not give every nested element the same large radius.

### Spacing

```css
--spacing: 0.27rem;
```

Tailwind spacing utilities are based on this custom spacing value in the supplied theme. Since this is smaller than Tailwind's usual default spacing base, check the rendered layout before using familiar spacing classes by habit. Prefer consistent spacing decisions and avoid arbitrary one-off values.

### Shadows

The design uses restrained, low-elevation shadows:

```css
--shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
--shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
--shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1),
             0 1px 2px -1px hsl(0 0% 0% / 0.1);
```

Use borders and surface contrast for most separation. Reserve stronger shadows for floating menus, dialogs, and overlays; avoid making every card appear to float.

## 7. Borders, focus, and selection

The base layer applies `border-border` and `outline-ring/50` globally. Another base rule sets `border-color: var(--border)` for all elements and pseudo-elements.

- Use the semantic `--border` token for standard separators.
- Use `--input` for input-related borders/surfaces where appropriate.
- Keep dividers subtle in the light theme.
- Preserve the visible focus treatment:
  ```css
  :focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
  ```
- Text selection uses a translucent violet tint:
  ```css
  ::selection {
    background-color: oklch(59.9% 0.23 286.2 / 0.22);
  }
  ```

Do not remove keyboard focus indicators just to achieve a cleaner appearance.

## 8. Motion and interaction

The CSS defines reusable animation keyframes:

| Animation | Behavior | Suitable uses |
|---|---|---|
| `drop-in` | Fade in while moving down from above | Navigation or top-level menus entering |
| `line-in` | Fade in, move slightly upward, and reduce blur | Short headline or text reveal; use sparingly |
| `shimmer` | Move a highlight from left to right | Loading skeletons or progress highlights |
| `nudge` | Fade out while scaling up | Brief attention/feedback effect |
| `fade-in` | Fade from transparent to visible | Overlays and simple entrances |
| `pop-in` | Fade in while scaling from 95% to full size | Small menus, tooltips, and compact feedback |
| `rise-in` | Fade in while moving upward | Content sections and cards entering |

### Motion principles

- Keep motion short and purposeful; avoid animating every element independently.
- Use movement to clarify spatial relationships, reveal hierarchy, and confirm user actions.
- For scene regeneration, distinguish **queued**, **generating**, **completed**, and **failed** states with clear status UI. Do not rely on animation alone to communicate status.
- Use Motion for React for component-level sequences and gestures; use the CSS keyframes for simple reusable effects.
- Avoid animating layout properties when a transform or opacity transition can achieve the same effect.
- Follow `prefers-reduced-motion: reduce`. The stylesheet reduces animation duration and disables smooth scrolling for users who request reduced motion.

### Press utility

```css
@utility press {
  transition: transform var(--duration-press) var(--ease-out);

  &:active {
    transform: scale(0.97);
  }
}
```

Use the `press` utility for appropriate tactile controls, such as buttons and clickable tiles. The referenced `--duration-press` and `--ease-out` variables are **not defined in the supplied CSS**; define them in the design tokens or replace them with valid project tokens before relying on this utility. Do not apply a scale effect to every control by default.

## 9. Surface effects and utilities

### Glass

The `glass` utility creates a translucent white surface with blur and saturation, and a darker translucent treatment in dark mode.

Use it selectively for overlays or floating navigation where content behind the surface remains legible. Avoid using glass for every card or panel. The `prefers-reduced-transparency: reduce` rule removes blur and uses the solid background.

### Violet glow

The `glow-violet` utility uses a subtle radial violet gradient. Treat this as an optional decorative effect for a specific focal area—not a default background for every screen. Keep the main action green.

### Hover variant

`hover-fine` applies hover styles only when the device supports hover and has a fine pointer. Use it for desktop-specific hover affordances; ensure touch users still have a clear active/selected state.

## 10. Accessibility and responsive behavior

The supplied CSS includes:

- `-webkit-text-size-adjust: 100%`
- Font smoothing
- Balanced heading wrapping and pretty paragraph wrapping
- Visible `:focus-visible` outline
- Reduced-motion support
- Reduced-transparency support
- Increased-contrast overrides for borders and inputs

Implementation requirements:

- Maintain semantic heading order and native button/link semantics.
- Make controls operable by keyboard and show focus clearly.
- Do not communicate generation status by color alone; pair status colors with text or icons.
- Ensure muted text and borders remain perceivable in both themes.
- Make dialogs, dropdowns, storyboard controls, and scene actions usable at narrow widths.
- Check contrast for every foreground/background pairing; token definitions alone do not guarantee WCAG compliance.
- Respect reduced-motion preferences in both CSS and Motion for React.

## 11. Scenova product UI patterns

These are product-specific recommendations based on Scenova's purpose; they are guidance, not additional CSS tokens.

### Dashboard

- Keep navigation stable and easy to scan.
- Use the sidebar tokens for navigation surfaces and active states.
- Make the “Create ad” or equivalent primary entry point easy to find.
- Prefer clear project names, recent activity, and explicit generation states over decorative dashboard widgets.

### Product-photo upload

- Provide a clearly bounded drop area and an obvious browse action.
- Explain supported formats and limits near the upload control.
- Show selected image previews, upload progress, and recoverable errors.
- Use the primary green accent for the main upload/continue action.

### Storyboard editor

- Keep the generated video preview visually dominant.
- Make scene order and per-scene controls understandable at a glance.
- Clearly distinguish the selected scene from unselected scenes using surface, border, and label treatment—not color alone.
- Keep **Regenerate scene** close to the relevant scene.
- Communicate the cost/credit impact before a user confirms a generation if credits are charged.
- Avoid heavy shadows and excessive rounding inside a dense editor; the video and storyboard should remain the focus.

### Generation states

Use explicit labels for states such as:

- Draft
- Queued
- Generating
- Ready
- Failed
- Cancelled

Use consistent status semantics across project cards, the editor, notifications, and history. Include a recovery action for failures when possible.

### Credits, plans, and provider settings

- Show remaining managed credits and estimated cost before a paid generation.
- Distinguish managed credits from bring-your-own-key (BYOK) usage.
- Explain provider/model choices in plain language.
- Use monospaced text only for technical values where it helps.
- Keep destructive actions visually distinct and require confirmation for irreversible actions.

### Forms and dialogs

- Use clear labels, helpful descriptions, and inline validation.
- Keep dialog actions in a consistent order and make the primary action obvious.
- Use destructive styling only for genuinely destructive actions.
- Avoid stacking multiple glass surfaces or heavy shadows.

## 12. Tailwind usage conventions

Use semantic design tokens first:

```tsx
<div className="bg-background text-foreground">
  <section className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
    <h2 className="font-sans text-foreground">Project title</h2>
    <p className="text-muted-foreground">Supporting description</p>
    <button className="bg-primary text-primary-foreground">Create ad</button>
  </section>
</div>
```

This is illustrative only; use the project's actual shadcn/ui components and button variants where available. Do not add raw hex/OKLCH colors in component code when an existing semantic token expresses the same role.

## 13. Theme behavior

- The light theme is defined in `:root`.
- The dark theme is activated by `.dark`.
- The Tailwind `dark` custom variant is based on `.dark` and its descendants.
- Theme switching should toggle the class using the app's existing theme mechanism; avoid defining a second, competing dark-mode strategy.
- Check component-specific colors in both modes, especially selected scenes, input borders, popovers, and sidebar active states.

## 14. Current CSS gaps to resolve

The following referenced variables are not defined in the supplied stylesheet:

- `--text-body`
- `--text-body--line-height`
- `--duration-press`
- `--ease-out`

Before treating this file as fully implementation-ready, either define these variables in the appropriate theme layer or update the consuming rules to use existing tokens. Also verify the custom `--spacing: 0.27rem` value is intentional, since it changes the scale of Tailwind spacing utilities.

The stylesheet contains two `@layer base` blocks and repeats some global border/outline rules. This may be intentional, but consolidate them if it improves maintainability without changing rendered behavior.

## 15. Rules for future design and implementation work

When adding or changing Scenova UI:

1. Read this file before introducing new colors, radii, shadows, or animation patterns.
2. Reuse existing tokens and shadcn/ui variants before inventing new ones.
3. Prefer Tailwind utilities over standalone CSS for ordinary layout and styling.
4. Add a new design token only when it represents a reusable, meaningful design decision.
5. Keep the green accent as the primary action color; use violet effects sparingly.
6. Preserve accessibility and reduced-motion behavior.
7. Test changes in light and dark modes and at narrow viewport widths.
8. For editor work, prioritize media clarity, scene selection, generation state, and predictable controls over decoration.

---

**Source of truth:** the Scenova global stylesheet supplied with this document. If this document and the actual CSS diverge, verify the intended design decision and update both deliberately.
