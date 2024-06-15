import { wait } from "./util";

async function asyncAwait() {
  const a: string = await wait(1000);
  console.log(a);

  const b: string = await wait(1000);
  console.log(b);

  const c: string = await wait(1000);
  console.log(c);

  return "async await ended!";
}

asyncAwait().then((res) => console.log(res));
