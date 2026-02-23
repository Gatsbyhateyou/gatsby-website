---
name: gsap-fundamentals
description: GSAP 基础动画能力。用 GreenSock 做 to/from/fromTo/set、时长与缓动、时间线、性能要点。在用户要求用 GSAP 做基础动画、描述不清具体参数、或需要淡入/滑动/缩放等常见模式时使用。
---

# GSAP Fundamentals

Core animation concepts with GreenSock Animation Platform.

## Quick Start

```bash
npm install gsap
```

```javascript
import gsap from 'gsap';

gsap.to('.box', {
  x: 200,
  duration: 1,
  ease: 'power2.out'
});
```

## Core Concepts

### Tween Types

| Method | Description | Use Case |
| --- | --- | --- |
| `gsap.to()` | Animate from current → target | Most common |
| `gsap.from()` | Animate from target → current | Entrance animations |
| `gsap.fromTo()` | Animate from defined start → end | Full control |
| `gsap.set()` | Instantly set properties | Initial state |

### Basic Tweens

```javascript
// To: current state → target
gsap.to('.element', {
  x: 100,
  y: 50,
  rotation: 360,
  duration: 1
});

// From: target → current state
gsap.from('.element', {
  opacity: 0,
  y: -50,
  duration: 0.5
});

// FromTo: explicit start and end
gsap.fromTo('.element',
  { opacity: 0, scale: 0.5 },
  { opacity: 1, scale: 1, duration: 1 }
);

// Set: instant property change
gsap.set('.element', { visibility: 'visible', opacity: 0 });
```

## Animation Properties

### Transform Properties

```javascript
gsap.to('.element', {
  x: 100,
  y: 50,
  xPercent: 50,
  yPercent: -100,
  rotation: 360,
  rotationX: 45,
  rotationY: 45,
  scale: 1.5,
  scaleX: 2,
  scaleY: 0.5,
  skewX: 20,
  skewY: 10,
  transformOrigin: 'center center',
  transformPerspective: 500,
  duration: 1
});
```

### CSS Properties

```javascript
gsap.to('.element', {
  color: '#00F5FF',
  backgroundColor: '#FF00FF',
  width: 200,
  height: '50%',
  padding: 20,
  opacity: 0.8,
  visibility: 'visible',
  display: 'block',
  borderRadius: '50%',
  boxShadow: '0 0 20px rgba(0, 245, 255, 0.5)',
  duration: 1
});
```

## Timing Controls

```javascript
gsap.to('.element', {
  x: 100,
  duration: 1,
  delay: 0.5,
  repeat: 3,
  repeatDelay: 0.2,
  yoyo: true
});

// Infinite repeat
gsap.to('.spinner', {
  rotation: 360,
  duration: 1,
  repeat: -1,
  ease: 'none'
});

// Stagger
gsap.to('.card', {
  y: 0,
  opacity: 1,
  duration: 0.5,
  stagger: 0.1
});

gsap.to('.grid-item', {
  scale: 1,
  duration: 0.3,
  stagger: { each: 0.05, from: 'center', grid: [4, 4], axis: 'x' }
});
```

## Easing Functions

```javascript
// Power: power1–4, .in / .out / .inOut
'power2.out'   // smooth deceleration
'power3.inOut' // strong both ends

// Special
'back.out(1.7)'  // overshoot
'elastic.out'     // springy
'bounce.out'     // ball-drop
'sine.out'       // gentle

// UI: snappy
gsap.to('.button', { scale: 1.1, ease: 'power2.out', duration: 0.2 });
// Entrances: smooth
gsap.from('.modal', { y: 100, opacity: 0, ease: 'power3.out', duration: 0.5 });
// Playful
gsap.to('.notification', { y: 0, ease: 'back.out(1.7)', duration: 0.6 });
// Mechanical
gsap.to('.progress', { width: '100%', ease: 'none', duration: 2 });
```

## Controlling Tweens

```javascript
const tween = gsap.to('.element', {
  x: 200,
  duration: 2,
  paused: true
});

tween.play();
tween.pause();
tween.reverse();
tween.restart();
tween.progress(0.5);
tween.timeScale(2);
tween.kill();
```

## Callbacks

```javascript
gsap.to('.element', {
  x: 200,
  duration: 1,
  onStart: () => console.log('Started'),
  onUpdate: () => console.log('Frame'),
  onComplete: () => console.log('Finished'),
  onRepeat: () => console.log('Repeated'),
  onReverseComplete: () => console.log('Reverse finished')
});
```

## Targeting

```javascript
gsap.to('.class', { x: 100 });
gsap.to('#id', { x: 100 });
gsap.to('[data-animate]', { x: 100 });

const el = document.querySelector('.box');
gsap.to(el, { x: 100 });

const items = document.querySelectorAll('.item');
gsap.to(items, { x: 100, stagger: 0.1 });
```

## Common Patterns

### Fade In/Out

```javascript
gsap.from('.element', { opacity: 0, duration: 0.5 });
gsap.to('.element', { opacity: 0, duration: 0.5, onComplete: () => element.remove() });
```

### Slide

```javascript
gsap.from('.panel', { x: -100, opacity: 0, duration: 0.5, ease: 'power2.out' });
gsap.from('.notification', { y: 50, opacity: 0, duration: 0.4, ease: 'power3.out' });
```

### Scale / Pop

```javascript
gsap.from('.modal', { scale: 0.8, opacity: 0, duration: 0.3, ease: 'back.out(1.7)' });
gsap.to('.heart', {
  scale: 1.2,
  duration: 0.3,
  repeat: -1,
  yoyo: true,
  ease: 'power1.inOut'
});
```

## Performance Tips

- Prefer **transform** and **opacity**: `x`, `y`, `scale`, `rotation`, `opacity` (GPU-friendly).
- Avoid animating `left`, `top`, `width`, `height` when possible (triggers layout).
- `gsap.set('.element', { force3D: true });` for GPU boost.
- Clean up: `tween.kill();` or `gsap.killTweensOf('.element');` on unmount.

## Reference

- Scroll-based animations: use ScrollTrigger (see gsap-scrolltrigger skill if available).
- React: use `@gsap/react` and `useGSAP` / `gsap.context` for scope and cleanup.
- Timelines and sequencing: use `gsap.timeline()` and position parameter (e.g. `'-=0.3'`).
