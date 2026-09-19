import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('returning-user sign-in routing', () => {
  it('does not gate password login on the browser-local locale prompt', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/app/login/page.tsx'),
      'utf8',
    );

    expect(source).not.toContain("nextRoute = '/onboarding/locale-confirm'");
  });

  it('routes new Google users to setup and returning users to dashboard', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/components/GoogleSignInButton.tsx'),
      'utf8',
    );

    expect(source).toContain("result.isNewUser ? '/setup' : '/dashboard'");
    expect(source).not.toContain("requiresPhoneCapture ? '/onboarding/locale-confirm'");
  });
});
