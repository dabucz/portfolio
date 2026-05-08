# SplitText animation integration in HTML
_Exported on 3/11/2026 at 21:33:25 GMT+1 from Cursor (2.6.18)_

---

**User**

import SplitText from "./SplitText";

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

<SplitText
  text="Hello, you!"
  className="text-2xl font-semibold text-center"
  delay={50}
  duration={1.25}
  ease="power3.out"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"
  onLetterAnimationComplete={handleAnimationComplete}
  showCallback
/>
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}) => {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      // Prevent re-animation if already completed
      if (animationCompletedRef.current) return;
      const el = ref.current;

      if (el._rbsplitInstance) {
        try {
          el._rbsplitInstance.revert();
        } catch (_) {
          /* noop */
        }
        el._rbsplitInstance = null;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      let targets;
      const assignTargets = self => {
        if (splitType.includes('chars') && self.chars.length) targets = self.chars;
        if (!targets && splitType.includes('words') && self.words.length) targets = self.words;
        if (!targets && splitType.includes('lines') && self.lines.length) targets = self.lines;
        if (!targets) targets = self.chars || self.words || self.lines;
      };

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === 'lines',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false,
        onSplit: self => {
          assignTargets(self);
          const tween = gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
                fastScrollEnd: true,
                anticipatePin: 0.4
              },
              onComplete: () => {
                animationCompletedRef.current = true;
                onCompleteRef.current?.();
              },
              willChange: 'transform, opacity',
              force3D: true
            }
          );
          return tween;
        }
      });

      el._rbsplitInstance = splitInstance;

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
        try {
          splitInstance.revert();
        } catch (_) {
          /* noop */
        }
        el._rbsplitInstance = null;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded
      ],
      scope: ref
    }
  );

  const renderTag = () => {
    const style = {
      textAlign,
      overflow: 'hidden',
      display: 'inline-block',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      willChange: 'transform, opacity'
    };
    const classes = `split-parent ${className}`;
    const Tag = tag || 'p';

    return (
      <Tag ref={ref} style={style} className={classes}>
        {text}
      </Tag>
    );
  };
  return renderTag();
};

export default SplitText;


make this work in a normal html and add this effect to the hero-title

---

**Cursor**

Let me also check the existing JS to understand what's already set up.

Let me check the relevant CSS for the hero title and line-reveal animations.

Now I have the full picture. I'll convert the React SplitText component to vanilla JS using GSAP + SplitText from CDN and apply it to the hero title.

Here's the plan:
1. Simplify the hero title HTML (remove the `.line-reveal` wrappers since SplitText handles splitting)
2. Add GSAP, ScrollTrigger, and SplitText CDN scripts
3. Add the vanilla JS SplitText animation to `app.js`
4. Add necessary CSS for the split chars

Now add the CSS for the split chars and the initial hidden state of the hero title:

Now add the vanilla JS SplitText animation to `app.js`:

Now add `initHeroSplitText()` to the `init()` function:

Let me verify the final state of the changes:

Everything looks good. Here's a summary of what was changed:

**`home.html`**
- Simplified the hero title markup — removed the `.line-reveal` / `.line-inner` wrappers and gave the `<h1>` an `id="hero-title"`. The `<span class="text-accent">` on "Designer" is preserved so it keeps its accent color.
- Added three GSAP CDN scripts before `app.js`: `gsap.min.js`, `ScrollTrigger.min.js`, and `SplitText.min.js`.

**`css/style.css`**
- Added `overflow: hidden` to `.hero-title` so chars can animate up from below the clip boundary.
- Added `.hero-title .split-char` with `display: inline-block` (required for `y` transforms on individual characters).

**`js/app.js`**
- Added `initHeroSplitText()` which:
  1. Waits for fonts to load (so SplitText measures correctly)
  2. Splits the hero title into individual characters using GSAP's `SplitText`
  3. Animates each char from `{ opacity: 0, y: 40 }` to `{ opacity: 1, y: 0 }` with a staggered delay of 50ms, using `power3.out` easing and 1.25s duration
  4. Uses `ScrollTrigger` so it fires once when the element enters the viewport
- Called `initHeroSplitText()` in the `init()` function (before the old text splits so it runs first)

The effect matches the React component's behavior — each character fades in and slides up with a stagger, triggered by scroll visibility.

