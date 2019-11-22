interface Selectable {
  select();
  deselect();
}

export class Selector<V extends Selectable> {
  value: V | null;

  select(value: V | null) {
    if (this.value) {
      this.value.deselect();
    }
    if (value !== null) {
      value.select();
    }
    this.value = value;
  }
}
