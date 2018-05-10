// block for `time` ms, then return the number of loops we could run in that time:
export function expensive(time) {
  const start = Date.now();
  let count = 0;
  while (Date.now() - start < time) {
    count += 1;
  }
  return count;
}

export function add(one, two) {
  return one + two;
}
