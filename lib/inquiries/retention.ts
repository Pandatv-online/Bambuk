export const INQUIRY_RETENTION_MONTHS = 12 as const;

export function getInquiryDeletionDeadline(receivedAt: number): string {
  const received = new Date(receivedAt);
  const year = received.getUTCFullYear();
  const month = received.getUTCMonth() + INQUIRY_RETENTION_MONTHS;
  const lastDayOfTargetMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(received.getUTCDate(), lastDayOfTargetMonth);

  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
}
