export function debounce<F extends (...args: any[]) => void>(fn: F, delay: number): F {
  let timeoutId: number | undefined;

  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}
