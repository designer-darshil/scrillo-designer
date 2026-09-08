import { gsap } from './gsapConfig';

export function animateTextReveal(
  element: HTMLElement | string,
  options: {
    delay?: number;
    duration?: number;
    stagger?: number;
    y?: number;
    ease?: string;
  } = {}
) {
  const {
    delay = 0,
    duration = 0.9,
    stagger = 0.04,
    y = 40,
    ease = 'power3.out',
  } = options;

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease,
    }
  );
}

export function animateScrollReveal(
  element: HTMLElement | string,
  triggerElement?: HTMLElement | string
) {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: triggerElement || element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  );
}
