const CAREERS_TIMEOUT_MS = 60_000;

export type CareerApplicationPayload = {
  name: string;
  email: string;
  phone?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  note?: string;
  resume?: File | null;
};

function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

let csrfBootstrapInFlight: Promise<void> | null = null;
async function ensureCsrfToken(): Promise<void> {
  if (typeof document === 'undefined') return;
  if (getCsrfToken() !== null) return;
  if (csrfBootstrapInFlight) return csrfBootstrapInFlight;

  csrfBootstrapInFlight = (async () => {
    try {
      await fetch('/auth/csrf', {
        method: 'GET',
        credentials: 'include',
      });
    } catch {
      // The actual form submission will surface a clearer error if the network is unavailable.
    } finally {
      csrfBootstrapInFlight = null;
    }
  })();

  return csrfBootstrapInFlight;
}

async function extractErrorMessage(response: Response, fallback: string) {
  const text = await response.text();
  if (!text) return fallback;
  try {
    const json = JSON.parse(text) as { error?: string; message?: string };
    return json.error || json.message || fallback;
  } catch {
    return fallback;
  }
}

export async function submitCareerApplication(payload: CareerApplicationPayload) {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('email', payload.email);
  if (payload.phone) formData.append('phone', payload.phone);
  if (payload.portfolioUrl) formData.append('portfolioUrl', payload.portfolioUrl);
  if (payload.linkedinUrl) formData.append('linkedinUrl', payload.linkedinUrl);
  if (payload.note) formData.append('note', payload.note);
  if (payload.resume) formData.append('resume', payload.resume);

  await ensureCsrfToken();

  const headers: Record<string, string> = {};
  const csrfToken = getCsrfToken();
  if (csrfToken) headers['X-XSRF-TOKEN'] = csrfToken;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CAREERS_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch('/api/careers/apply', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers,
      signal: controller.signal,
    });
  } catch (error: unknown) {
    if ((error as Record<string, unknown>).name === 'AbortError') {
      throw new Error('Application upload timed out. Please try again.');
    }
    throw new Error('No connection to server.');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, `Application failed (${response.status})`));
  }

  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Unexpected server response.');
  }
}
