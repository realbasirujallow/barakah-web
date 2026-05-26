export const DEFAULT_ONBOARDING_TRIAL_DAYS = 30;
export const DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL = `${DEFAULT_ONBOARDING_TRIAL_DAYS} days`;
export const DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL = `${DEFAULT_ONBOARDING_TRIAL_DAYS}-day`;

// ACTIVATION-2 (2026-05-24): the card-on-file, auto-converting trial. This is
// the Stripe-checkout trial that collects a card up front and auto-charges
// when it ends — distinct from the card-LESS onboarding trial above. Tuned
// short (7 days) so intent-to-pay is captured while the user is engaged.
// FOUNDER REVIEW: confirm 7 days is the desired window before enabling.
export const CARD_ON_FILE_TRIAL_DAYS = 7;
export const CARD_ON_FILE_TRIAL_DAYS_LABEL = `${CARD_ON_FILE_TRIAL_DAYS} days`;
