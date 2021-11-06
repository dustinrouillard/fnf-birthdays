export function stringFmt(string: string, ...args: (string | number)[]): string {
  for (const arg of args) {
    string = string.replace('%s', arg.toString());
  }

  return string;
}