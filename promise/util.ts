type Gen<T> = Generator<Promise<T>, T>;

export function resolver<T>(generator: Gen<T>, callback?: (value: T) => void) {
  return onFulfilled(generator, undefined, callback);
}

function onFulfilled<T>(gen: Gen<T>, res?: T, callback?: (value: T) => void) {
  const next = gen.next(res);
  return handler(gen, next, callback);
}

function onRejected<T>(gen: Gen<T>, err: unknown) {
  const next = gen.throw(err);
  return handler(gen, next);
}

function handler<T>(
  iter: Gen<T>,
  next: IteratorResult<Promise<T>, T>,
  callback?: (value: T) => void
) {
  const value = Promise.resolve(next.value);

  if (next.done) {
    value.then((res) => callback?.(res));

    return value;
  }

  value.then(
    (res) => onFulfilled(iter, res, callback),
    (err) => onRejected(iter, err)
  );
}

export function wait(ms: number, rejected?: boolean) {
  return new Promise<string>((resolve, reject) => {
    const random = Math.random();

    setTimeout(rejected ? reject : () => resolve(random.toString()), ms);
  });
}
