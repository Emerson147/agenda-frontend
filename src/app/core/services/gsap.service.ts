import { Injectable, inject, PLATFORM_ID, DestroyRef, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

// Register plugins safely in browser environment
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip);
}

export type AnimationTarget = gsap.DOMTarget | ElementRef;

@Injectable({
  providedIn: 'root'
})
export class GsapService {
  private platformId = inject(PLATFORM_ID);
  public readonly isBrowser = isPlatformBrowser(this.platformId);

  // Expose raw instances for advanced use
  public readonly engine = gsap;
  public readonly flipPlugin = Flip;

  /**
   * Helper to normalize Angular ElementRef or string selector to standard DOM target
   */
  private resolveTarget(target: AnimationTarget): gsap.DOMTarget {
    if (target && typeof target === 'object' && 'nativeElement' in target) {
      return (target as ElementRef).nativeElement;
    }
    return target as gsap.DOMTarget;
  }

  /**
   * Encapsulate animations within a safe GSAP Context.
   * Automatically kills all animations and triggers when component is destroyed.
   */
  createScope(
    scope: AnimationTarget,
    animationFn: (ctx: gsap.Context) => void,
    destroyRef?: DestroyRef
  ): gsap.Context | null {
    if (!this.isBrowser) return null;

    const resolvedScope = this.resolveTarget(scope) as Element;
    const ctx = gsap.context(animationFn, resolvedScope);

    if (destroyRef) {
      destroyRef.onDestroy(() => {
        ctx.revert();
      });
    }

    return ctx;
  }

  /**
   * Smooth Stagger entrance for lists, cards, and navigation items
   */
  staggerFadeIn(
    targets: AnimationTarget,
    vars: gsap.TweenVars = {}
  ): gsap.core.Tween | null {
    if (!this.isBrowser) return null;

    return gsap.from(this.resolveTarget(targets), {
      opacity: 0,
      y: 16,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
      ...vars
    });
  }

  /**
   * Modal / Window entrance animation (M3 scale + fade pop)
   */
  openModal(
    modal: AnimationTarget,
    backdrop?: AnimationTarget
  ): gsap.core.Timeline | null {
    if (!this.isBrowser) return null;

    const tl = gsap.timeline();
    const modalEl = this.resolveTarget(modal);

    if (backdrop) {
      tl.fromTo(
        this.resolveTarget(backdrop),
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power1.out' },
        0
      );
    }

    tl.fromTo(
      modalEl,
      { opacity: 0, scale: 0.94, y: 12 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        ease: 'back.out(1.2)'
      },
      0.05
    );

    return tl;
  }

  /**
   * Modal / Window exit animation
   */
  closeModal(
    modal: AnimationTarget,
    backdrop?: AnimationTarget,
    onComplete?: () => void
  ): gsap.core.Timeline | null {
    if (!this.isBrowser) {
      onComplete?.();
      return null;
    }

    const tl = gsap.timeline({
      onComplete: () => onComplete?.()
    });

    const modalEl = this.resolveTarget(modal);

    tl.to(modalEl, {
      opacity: 0,
      scale: 0.94,
      y: 8,
      duration: 0.2,
      ease: 'power2.in'
    });

    if (backdrop) {
      tl.to(
        this.resolveTarget(backdrop),
        { opacity: 0, duration: 0.2, ease: 'power1.in' },
        0
      );
    }

    return tl;
  }

  /**
   * FLIP: Capture element state before a layout/DOM mutation
   */
  getFlipState(targets: AnimationTarget, vars?: Flip.GetStateVars): Flip.FlipState | null {
    if (!this.isBrowser) return null;
    return Flip.getState(this.resolveTarget(targets), vars);
  }

  /**
   * FLIP: Animate smoothly from the captured state to the new layout
   */
  fromFlip(
    state: Flip.FlipState,
    vars: Flip.FromVars = {}
  ): gsap.core.Tween | gsap.core.Timeline | null {
    if (!this.isBrowser) return null;

    return Flip.from(state, {
      duration: 0.45,
      ease: 'power2.inOut',
      scale: true,
      fade: true,
      absolute: true,
      ...vars
    });
  }

  /**
   * Pulse attention animation (e.g. active pomodoro or alert)
   */
  pulse(target: AnimationTarget, vars: gsap.TweenVars = {}): gsap.core.Tween | null {
    if (!this.isBrowser) return null;

    return gsap.fromTo(
      this.resolveTarget(target),
      { scale: 1 },
      {
        scale: 1.05,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
        ...vars
      }
    );
  }
}
