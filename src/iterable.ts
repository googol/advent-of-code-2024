export function* mapIterable<Tin, Tout>(
  input: Iterable<Tin>,
  mapper: (element: Tin) => Tout,
): Iterable<Tout> {
  for (const element of input) {
    yield mapper(element);
  }
}

export function* flatMapIterable<Tin, Tout>(
  input: Iterable<Tin>,
  mapper: (element: Tin) => Iterable<Tout>,
): Iterable<Tout> {
  for (const element of input) {
    yield* mapper(element);
  }
}

export function filterIterable<T, Tout extends T>(
  input: Iterable<T>,
  predicate: (element: T) => element is Tout,
): Iterable<Tout>;
export function filterIterable<T>(
  input: Iterable<T>,
  predicate: (element: T) => boolean,
): Iterable<T>;
export function* filterIterable<T>(
  input: Iterable<T>,
  predicate: (element: T) => boolean,
): Iterable<T> {
  for (const element of input) {
    if (predicate(element)) {
      yield element;
    }
  }
}

export function* zipIterable<Tleft, Tright>(
  left: Iterable<Tleft>,
  right: Iterable<Tright>,
): Iterable<[Tleft, Tright]> {
  const leftIterator = left[Symbol.iterator]();
  const rightIterator = right[Symbol.iterator]();

  while (true) {
    const leftResult = leftIterator.next();
    const rightResult = rightIterator.next();

    if (leftResult.done || rightResult.done) {
      return;
    }

    yield [leftResult.value, rightResult.value];
  }
}

export function someIterable<Tin>(
  input: Iterable<Tin>,
  predicate: (element: Tin) => boolean,
): boolean {
  for (const element of input) {
    if (predicate(element)) {
      return true;
    }
  }
  return false;
}

export function everyIterable<Tin>(
  input: Iterable<Tin>,
  predicate: (element: Tin) => boolean,
): boolean {
  for (const element of input) {
    if (!predicate(element)) {
      return false;
    }
  }
  return true;
}

export function* concatIterable<T>(
  iterables: Iterable<Iterable<T>>,
): Iterable<T> {
  for (const iterable of iterables) {
    for (const element of iterable) {
      yield element;
    }
  }
}

export function reduceIterable<Tin, Tout>(
  iterable: Iterable<Tin>,
  reducer: (accumulator: Tout, element: Tin) => Tout,
  initialValue: Tout,
): Tout {
  let currentValue = initialValue;

  for (const element of iterable) {
    currentValue = reducer(currentValue, element);
  }

  return currentValue;
}

export class IterableWrapper<T> implements Iterable<T> {
  private readonly inner: Iterable<T>;

  constructor(input: Iterable<T>) {
    this.inner = input;
  }

  [Symbol.iterator](): Iterator<T> {
    return this.inner[Symbol.iterator]();
  }

  toArray(): T[] {
    return Array.from(this.inner);
  }

  toSet(): Set<T> {
    const result = new Set<T>();
    for (const element of this.inner) {
      result.add(element);
    }
    return result;
  }

  toMap<Key, Value>(selector: (element: T) => [Key, Value]): Map<Key, Value>;
  toMap<Key, Value>(
    keySelector: (element: T) => Key,
    valueSelector: (element: T) => Value,
  ): Map<Key, Value>;
  toMap<Key, Value>(
    ...args:
      | [(element: T) => [Key, Value]]
      | [(element: T) => Key, (element: T) => Value]
  ) {
    if (args.length === 1) {
      return new Map(this.map(args[0]));
    } else {
      return new Map(
        this.map((element) => [args[0](element), args[1](element)]),
      );
    }
  }

  some(predicate: (element: T) => boolean): boolean {
    return someIterable(this.inner, predicate);
  }

  every(predicate: (element: T) => boolean): boolean {
    return everyIterable(this.inner, predicate);
  }

  map<Tout>(mapper: (element: T) => Tout): IterableWrapper<Tout> {
    return new IterableWrapper(mapIterable(this.inner, mapper));
  }

  flatMap<Tout>(mapper: (element: T) => Iterable<Tout>): IterableWrapper<Tout> {
    return new IterableWrapper(flatMapIterable(this.inner, mapper));
  }

  filter<Tout extends T>(
    predicate: (element: T) => element is Tout,
  ): IterableWrapper<Tout>;

  filter(predicate: (element: T) => boolean): IterableWrapper<T>;

  filter(predicate: (element: T) => boolean): IterableWrapper<T> {
    return new IterableWrapper(filterIterable(this.inner, predicate));
  }

  zip<Tright>(right: Iterable<Tright>): IterableWrapper<[T, Tright]> {
    return new IterableWrapper(zipIterable(this.inner, right));
  }

  reduce<Tout>(
    reducer: (accumulator: Tout, element: T) => Tout,
    initialValue: Tout,
  ): Tout {
    return reduceIterable(this.inner, reducer, initialValue);
  }
}

export function iterate<T>(input: Iterable<T>): IterableWrapper<T> {
  return new IterableWrapper(input);
}

export function* range(options?: {
  start?: number;
  step?: number;
}): Iterable<number> {
  const { start = 0, step = 1 } = options ?? {};

  let current = start;

  while (true) {
    yield current;

    current += step;
  }
}
