import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, it, expect } from 'vitest';
import ModalShell from '../components/ui/ModalShell';

/**
 * Accessibility gate. Runs axe-core (structural rules) over key UI in the
 * normal `npm run test` pass so a11y regressions (missing labels, bad ARIA,
 * unlabeled controls) fail CI instead of shipping. Color-contrast is disabled:
 * jsdom has no layout engine, so axe can't evaluate it here — contrast is a
 * separate Lighthouse/device check (see audits/accessibility-audit).
 *
 * Extend the SUBJECTS list as more presentational components are made
 * axe-clean; each new entry raises the a11y floor.
 */
const AXE_OPTS = { rules: { 'color-contrast': { enabled: false } } } as const;

async function violationsFor(container: HTMLElement) {
  const results = await axe.run(container, AXE_OPTS);
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`);
}

describe('a11y (axe-core structural)', () => {
  it('ModalShell renders an accessible dialog with a labeled form', async () => {
    const { container } = render(
      <ModalShell onClose={() => {}} ariaLabel="Edit scenario">
        <div>
          <h2>Edit scenario</h2>
          <label htmlFor="scenario-name">Scenario name</label>
          <input id="scenario-name" type="text" />
          <button type="button">Save</button>
          <button type="button" aria-label="Close dialog">×</button>
        </div>
      </ModalShell>,
    );
    expect(await violationsFor(container)).toEqual([]);
  });

  it('flags a genuinely inaccessible control (guard against a no-op axe setup)', async () => {
    // An icon-only button with no accessible name MUST be caught — proves the
    // gate actually detects violations rather than silently passing everything.
    const { container } = render(
      <div>
        <button type="button"><svg aria-hidden="true" width="16" height="16" /></button>
      </div>,
    );
    expect((await violationsFor(container)).length).toBeGreaterThan(0);
  });
});
