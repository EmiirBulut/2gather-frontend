# Design System Document

## 1. Overview & Creative North Star: "The Architectural Atelier"
This design system moves beyond the "app-as-a-utility" mindset and enters the realm of the digital concierge. Our Creative North Star is **The Architectural Atelier**. 

We are not just building a planning tool; we are providing a serene, professional environment where complex decisions feel effortless. To achieve this, the design system rejects the "boxed-in" nature of traditional mobile grids. We embrace **intentional asymmetry**, **tonal layering**, and **expansive whitespace**. By utilizing a high-contrast typography scale (pairing the functional Inter with the geometric, editorial Manrope), we create a sense of rhythm and hierarchy that feels like a premium home design magazine rather than a spreadsheet.

---

## 2. Colors & The Tonal Philosophy
The palette is rooted in nature—warm whites, stone-like greys, and the grounding presence of muted sage (`primary`). 

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are prohibited for sectioning. We define space through background shifts. A section should be differentiated from the page by moving from `surface` (`#fafaf5`) to `surface-container-low` (`#f4f4ef`). This creates a "soft-edge" layout that feels architectural and expansive.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium cardstock.
*   **Base:** `surface` (#fafaf5) – The primary canvas.
*   **Sub-sections:** `surface-container-low` (#f4f4ef) – For large background areas or secondary sections.
*   **Interactive Elements:** `surface-container-highest` (#e2e3de) – For high-importance inactive elements.
*   **The "Glass & Gradient" Signature:** For floating action buttons or hero banners, use a subtle gradient from `primary` (#475949) to `primary_container` (#5f7161). This prevents the "flat-UI" fatigue and adds a tactile, backlit quality to the interface.

---

## 3. Typography: The Editorial Engine
We use typography to establish a clear voice: **Bricolage Grotesque** for the "Designer’s Voice" (Headlines) and **Inter** for "The Planning Detail" (Body).

*   **Display & Headlines (Bricolage Grotesque):** These are our "hero" moments. Use `display-lg` (3.5rem) with tight letter-spacing to anchor a page. Headlines should often be left-aligned with significant bottom padding to create an asymmetric, editorial feel.
*   **Body & Labels (Inter):** High legibility is non-negotiable. Use `body-md` (0.875rem) for standard text.
*   **The Contrast Principle:** Pair a `headline-lg` in `on_surface` with a `label-sm` in `primary` (all-caps) to create a sophisticated, labeled-diagram look typical of architectural blueprints.

---

## 4. Elevation & Depth: Tonal Layering
We do not use depth to show "height"; we use it to show "focus."

*   **The Layering Principle:** Instead of shadows, stack `surface-container-lowest` (#ffffff) cards onto a `surface-container-low` (#f4f4ef) background. This creates a natural, clean lift.
*   **Ambient Shadows:** Where a floating effect is required (e.g., a Bottom Sheet), use an extra-diffused shadow: `box-shadow: 0 12px 40px rgba(26, 28, 25, 0.06)`. This uses a 6% opacity version of the `on_surface` color, mimicking natural daylight.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` (#c3c8c1) at 20% opacity. Never use a 100% opaque border.
*   **Glassmorphism:** For top navigation bars, use `surface` at 80% opacity with a `backdrop-filter: blur(20px)`. This allows the "materials" of the home plan to peek through as the user scrolls.

---

## 5. Components: Refined Interaction

### Buttons & Chips
*   **Primary Button:** Uses the `primary` (#475949) fill with `DEFAULT` (0.5rem/8px) or `md` (0.75rem/12px) corners. No border.
*   **Secondary/Tertiary:** Use `secondary_container` with no border. The transition between states should be a subtle shift in tonal density, not a color change.
*   **Chips:** Selection chips should use the `full` (9999px) roundedness scale. Use `primary_fixed` (#d4e8d4) for active states to provide a soft, non-aggressive "selected" feel.

### Input Fields & Lists
*   **Inputs:** Forbid the "box" look. Use a `surface-container-low` background with a subtle 2px bottom stroke in `outline_variant` that transforms into `primary` on focus.
*   **Cards & Lists:** **Strictly forbid divider lines.** Use vertical white space (recommended 24px or 32px) to separate list items. If separation is visually required, use a alternating background color shift between `surface` and `surface-container-low`.

### Specialized Home Planning Components
*   **The "Blueprint Card":** Use a `surface-container-lowest` card with an inset `outline_variant` (at 10% opacity) to house floor plans or sketches.
*   **The Material Swatch:** A specialized chip-like component that uses `md` (12px) rounding to display textures or colors, paired with `label-md` for technical specs.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place a `headline-md` on the left and a small `label-sm` action on the far right to create a sophisticated, unbalanced balance.
*   **Embrace Whitespace:** If a screen feels "busy," increase the vertical padding between sections rather than adding a divider line.
*   **Tint Your Greys:** Always use the warm-grey neutrals provided (`surface_variant`, etc.) to keep the "Home" feeling warm. Avoid #000000 or pure #888888.

### Don’t:
*   **Don’t use 1px dividers.** This is the fastest way to make this design system look like a generic template.
*   **Don’t use high-intensity shadows.** If the shadow is clearly visible, it is too dark. It should feel like a "whisper" of depth.
*   **Don’t crowd the edges.** Maintain a minimum of 24px margin on the horizontal axis to ensure the "Editorial" feel.