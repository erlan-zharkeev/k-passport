export enum LogColor {
  error = '\x1b[31m%s\x1b[0m',
  success = '\x1b[32m%s\x1b[0m',
  info = '\x1b[34m%s\x1b[0m',
}
export const cLog = (text: string, color: LogColor = LogColor.info) => {
  return console.log(`\x1b[47;1m${color}`, ` ${text} `);
};
