export function *range(bottom: number, top?: number) {
  if (top === undefined) {
    top = bottom;
    bottom = 0;
  }

  for (let i = bottom; i < top; i++) {
    yield i;
  }
}
