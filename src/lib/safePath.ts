// SECURITY: notification links (and other server-provided hrefs) could be
// manipulated. Only allow internal paths — never host-qualified URLs,
// protocol-relative (`//example.com`), or back-slashed (`/\\foo`) values
// that some browsers interpret as external redirects.
export function isSafeInternalPath(href: string | null | undefined): href is string {
  return !!href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/\\');
}
