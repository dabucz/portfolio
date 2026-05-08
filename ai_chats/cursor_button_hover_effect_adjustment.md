# Button hover effect adjustment
_Exported on 4/23/2026 at 14:19:37 GMT+2 from Cursor (3.1.17)_

---

**User**

when you hover over any button make it come from cursor instead of the left side

---

**Cursor**

Let me look at the current button hover styles.

Now let me check the JS file to understand what's there.

The current effect slides from left to right using `scaleX`. I'll replace it with a radial circle that expands from the cursor's entry point. This needs a CSS change plus a small JS function to track the mouse position on each button.

Now add the JS function to track cursor position on buttons and register it in `init()`.

Here's what changed:

**CSS** — the `::before` pseudo-element is now a circle positioned at `--btn-x` / `--btn-y` (defaulting to center). It scales from 0 to full size (`scale(0) → scale(1)`) staying centred on the entry point via `translate(-50%, -50%)`. The circle is sized at 300% of the button's width so it always fully covers the button regardless of where the cursor enters.

**JS** — `initButtonHover()` listens for `mouseenter` on every `.btn` and writes the cursor's position relative to the button into `--btn-x` / `--btn-y`. The position is captured on `mouseenter` so the circle always bursts from exactly where your cursor crossed the button edge.

---
