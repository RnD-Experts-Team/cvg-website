"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationOptions {
  /** CSS selector for child elements to animate (staggered) */
  childSelector?: string;
  /** From properties */
  from?: gsap.TweenVars;
  /** To properties */
  to?: gsap.TweenVars;
  /** Stagger delay between children */
  stagger?: number;
  /** Animation duration */
  duration?: number;
  /** GSAP ease string */
  ease?: string;
  /** ScrollTrigger start position */
  start?: string;
  /** Animate the container itself (if no childSelector) */
  animateContainer?: boolean;
}

/**
 * Reusable hook that applies a GSAP scroll-triggered animation
 * to a container ref (and optionally its children with stagger).
 */
export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);

  const {
    childSelector,
    from = { autoAlpha: 0, y: 40 },
    to = {},
    stagger = 0.12,
    duration = 0.8,
    ease = "power3.out",
    start = "top 85%",
    animateContainer = false,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = childSelector
      ? el.querySelectorAll(childSelector)
      : animateContainer
        ? el
        : null;

    if (!targets) return;
    if (targets instanceof NodeList && targets.length === 0) return;

    // Set initial state so elements are hidden before scroll
    gsap.set(targets, { ...from });

    const tween = gsap.to(targets, {
      ...from, // reset keys
      ...{
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
      },
      ...to,
      stagger: targets instanceof NodeList ? stagger : 0,
      duration,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none", // play once on enter
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [childSelector, stagger, duration, ease, start, animateContainer]);

  return ref;
}
