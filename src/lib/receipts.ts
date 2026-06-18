// 2026-06-18 (Side Hustle Phase 3): shared types + helpers for transaction
// receipts. A receipt is a photo/PDF attached to a transaction for tax
// substantiation. Family-gated, mirroring the Side Hustle gating: WRITES
// (upload/delete) require requireFamilyPlan (403 + PAYWALL_SHOWN); READS
// (list/download) use the non-firing hasFamilyPlan → HTTP-200 locked payload
// {locked:true,requiredPlan:'family'} so mount-polled reads never trip the
// paywall analytics. See the backend contract + lib/sideHustle.ts.

// `isLocked` and `LockedPayload` are shared with the Side Hustle reads — re-
// export them so receipt callers branch the same way without a second copy.
export { isLocked } from './sideHustle';
export type { LockedPayload } from './sideHustle';

/** Receipt metadata — matches the backend `receipt` JSON shape. NEVER carries
 *  the raw bytes (the list/upload endpoints use a projection that excludes the
 *  BYTEA data column). */
export interface ReceiptMeta {
  id: number;
  filename: string;
  contentType: string;
  sizeBytes: number;
  /** Epoch millis. */
  createdAt: number;
}

/** Response from GET /api/transactions/{id}/receipts. */
export interface ReceiptListResponse {
  receipts: ReceiptMeta[];
  count: number;
}

/** Max upload size — 10 MB, mirroring the backend in-handler cap and the
 *  servlet multipart limit so the client rejects oversize files before the
 *  round-trip. */
export const RECEIPT_MAX_BYTES = 10 * 1024 * 1024;

/** Client-side accept filter, mirroring the backend (any image/* OR PDF). Used
 *  for both the <input accept> attribute and the pre-upload guard. */
export const RECEIPT_ACCEPT = 'image/*,application/pdf';

/** True when the file's declared MIME type is one the backend will accept
 *  (any image/* or application/pdf). The backend re-checks this server-side;
 *  this is only a fast-fail so the user gets an instant, localized error. */
export function isAcceptedReceiptType(type: string | undefined | null): boolean {
  if (!type) return false;
  return type.startsWith('image/') || type === 'application/pdf';
}

/** Human-readable size for a receipt row (e.g. "2.4 MB", "812 KB", "640 B").
 *  Locale-aware number formatting so Arabic/Urdu/French users see localized
 *  digits/separators without per-locale i18n keys. */
export function formatReceiptSize(bytes: number, locale: string | undefined): string {
  const fmt = (n: number, digits: number) =>
    new Intl.NumberFormat(locale || 'en', { maximumFractionDigits: digits }).format(n);
  if (bytes >= 1024 * 1024) return `${fmt(bytes / (1024 * 1024), 1)} MB`;
  if (bytes >= 1024) return `${fmt(bytes / 1024, 0)} KB`;
  return `${fmt(bytes, 0)} B`;
}
