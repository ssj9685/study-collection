import { resolver, wait } from "./util";

function* generator() {
  const a: string = yield wait(1000);
  console.log(a);

  const b: string = yield wait(2000);
  console.log(b);

  const c: string = yield wait(1000);
  console.log(c);

  return "generator ended!";
}

resolver(generator(), (res) => console.log(res));
