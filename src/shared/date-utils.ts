export class DateUtils {
  static isValidISOFormat(dateStr: string | Date): boolean {
    if (dateStr instanceof Date) return true;
    if (typeof dateStr !== 'string') return false;
    
    // Strict ISO 8601 check: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ
    const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z)?$/;
    return isoRegex.test(dateStr);
  }

  static isValidRealDate(dateStr: string | Date): boolean {
    if (!dateStr) return false;
    
    // First check format if it's a string
    if (typeof dateStr === 'string' && !this.isValidISOFormat(dateStr)) {
      return false;
    }
    
    // If it's already a Date object, convert to ISO string first
    const isoStr = dateStr instanceof Date ? dateStr.toISOString() : dateStr;
    
    // Extract YYYY-MM-DD
    const match = isoStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return false;

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);

    // JavaScript Date constructor rolls over invalid dates (e.g., April 31 -> May 1)
    // We check if the resulting Date object matches the original components
    const date = new Date(year, month - 1, day);
    
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  static calculateWorkingDays(startDate: string | Date, endDate: string | Date, dayOffs: { date: string }[] = []): number {
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(0, 0, 0, 0);

    const validDayOffDates = new Set(
      dayOffs
        .map(d => d.date)
        .filter(dateStr => {
          const d = new Date(dateStr);
          d.setUTCHours(0, 0, 0, 0);
          return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
        })
    );

    let workingDaysCount = 0;
    const curDate = new Date(start.getTime());

    while (curDate.getTime() <= end.getTime()) {
      const dayOfWeek = curDate.getUTCDay();
      const dateStr = curDate.toISOString().split('T')[0];

      // Only count if it's a weekday AND NOT in the valid dayOff list
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !validDayOffDates.has(dateStr)) {
        workingDaysCount++;
      }
      curDate.setUTCDate(curDate.getUTCDate() + 1);
    }
    return workingDaysCount;
  }
}
