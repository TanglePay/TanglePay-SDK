

export function convertDateToUnixTimestamp(date: Date) {
  return date ? Math.round(date.getTime() / 1000) : date;
}


