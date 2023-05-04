

export function convertDateToUnixTimestamp(date: Date) {
  return date ? Math.round(date.getTime() / 1000) : date;
}


export function decimalToHex(number: number, prefix = false): string {
  return prefix ? '0x' + number.toString(16) : number.toString(16)
}