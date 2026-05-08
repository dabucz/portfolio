# Mouse disable functionality in JavaScript
_Exported on 4/29/2026 at 18:00:52 GMT+2 from Cursor (3.2.16)_

---

**User**

Add ability to disable the mouse using a var in js

---

**Cursor**

Now update `initCursor` and all mouse-driven features to bail out early when `CONFIG.mouseEnabled` is `false`:

All mouse-driven features — the custom cursor, magnetic buttons, card tilt, and button hover origin — now check `CONFIG.mouseEnabled` at the top of their respective functions. To disable all mouse interactions, just flip the flag at the top of the file:

```1:10:portfolio/js/app.js
(function () {
    "use strict";
    let lenis = null;

    /* ------------------------------------------
       FEATURE FLAGS
       ------------------------------------------ */

    const CONFIG = {
        mouseEnabled: true,
    };
```

Set `mouseEnabled: false` and every mouse-specific feature is skipped entirely on page load.

---

**User**

now I cant see my cursor and also there is the green blob

---

**Cursor**

The issue is two-fold:

1. The `.cursor` element starts at `0,0` and is visible before the mouse has moved — that's the "green blob" in the corner.
2. `cursor: none` is set globally in CSS, so the real system cursor is always hidden regardless of the flag.

I'll fix both: start the custom cursor hidden and only reveal it on the first mouse move, and restore the system cursor via a CSS class when `mouseEnabled` is `false`.

Now add the `.cursor-disabled` CSS class that restores the system cursor:

Two fixes applied:

- **Green blob on load** — the custom cursor now starts with the `hidden` class and only becomes visible after the mouse first enters the page, so it never flashes at `0,0`.
- **Disabled mouse mode** — when `mouseEnabled: false`, the body gets a `cursor-disabled` class that hides the `.cursor` element and restores the native `cursor: auto` on `body`, `a`, `button`, `input`, and `textarea`.

