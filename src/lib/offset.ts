export type Point = { x: number; y: number };

/**
 * Offset of `el` within `ancestor`, summed up the offsetParent chain. A single
 * offsetTop isn't enough: animated elements (with a transform or will-change)
 * become offset parents themselves, so the chain can stop short of the
 * ancestor. Offsets ignore transforms, which suits measuring layout that is
 * mid-animation.
 */
export function offsetWithin(el: HTMLElement, ancestor: HTMLElement): Point {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}
