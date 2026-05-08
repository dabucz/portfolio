# View transition effect design
_Exported on 3/12/2026 at 09:23:58 GMT+1 from Cursor (2.6.18)_

---

**User**

add a view transition that should make the original page 10% smaller and slide 10% up so that the top isnt visible and it should slide the new page from bottom

---

**Cursor**

I’ll wire this in directly in your portfolio so navigation uses a custom View Transition: the outgoing page scales to 90% and moves up by 10%, while the incoming page slides up from the bottom. I’m checking your current transition CSS/JS hooks first, then I’ll patch them.

I found there isn’t an existing `viewTransition.css` file in use, so I’m going to add the transition rules into your main stylesheet where it’s already loaded on every page. I’ll quickly check for any existing View Transition styles first to avoid conflicts.

I confirmed there are no transition hooks yet, so I’m adding a native cross-page View Transition block in `css/style.css` with your exact motion: old page scales to 90% and shifts up by 10%, new page enters from the bottom.

Added this in `portfolio/css/style.css` so page-to-page navigation now uses native View Transitions:

- Outgoing page animates to `scale(0.9)` and `translateY(-10%)`
- Incoming page animates from `translateY(100%)` to `translateY(0)`
- Same easing/duration applied to both layers for a smooth handoff
- Reduced-motion fallback included

A quick note: your editor shows a warning for `@view-transition` because some CSS linters don’t recognize that at-rule yet, but it’s expected and valid in browsers that support cross-document View Transitions (Chromium-based browsers).

If you want, I can also tune the feel (e.g. slower/faster, or make the incoming page come from `80%` instead of `100%` for a shorter slide).

