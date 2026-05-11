// 2026-05-11 (UX-2 fix): /dashboard/settings used to 404. The in-app
// nav goes to /dashboard/profile, /dashboard/notifications, and
// /dashboard/fiqh — but "settings" is the URL most users guess from
// browser history or external links. Redirect to the canonical
// settings page so the dead-end goes away.
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/dashboard/profile');
}
