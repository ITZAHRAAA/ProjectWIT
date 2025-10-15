// utils/proration.js
function calculateProration({ currentStart, currentEnd, now = new Date(), paidCents = 0, adminFeePercent = 0 }) {
  const start = new Date(currentStart);
  const end = new Date(currentEnd);
  const nowDate = new Date(now);

  const totalMs = end - start;
  if (totalMs <= 0) return { refundCents: 0, feeCents: 0 };

  const remainingMs = Math.max(0, end - nowDate);
  const refundCents = Math.floor((remainingMs / totalMs) * paidCents);
  const fee = Math.floor(refundCents * (adminFeePercent / 100));
  return { refundCents: refundCents - fee, feeCents: fee };
}

module.exports = { calculateProration };
