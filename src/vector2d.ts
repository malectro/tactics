export interface Vector2d {
  x: number,
  y: number,
}

export interface Size extends Vector2d {};

export interface Sized {
  size: Vector2d;
}

export interface Positioned {
  position: Vector2d;
}
