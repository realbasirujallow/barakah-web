import { StrictMode } from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ModalShell from '../components/ui/ModalShell';
import { useBodyScrollLock } from '../lib/useBodyScrollLock';

function Overlays({ pageOpen, modalOpen }: { pageOpen: boolean; modalOpen: boolean }) {
  useBodyScrollLock(pageOpen);
  return modalOpen ? <ModalShell onClose={() => {}}><button>Close</button></ModalShell> : <p>Transactions</p>;
}

afterEach(() => { cleanup(); document.body.style.overflow = ''; });

describe('shared body scroll lock', () => {
  it.each(['page-first', 'modal-first'])('unlocks after overlapping owners close: %s', order => {
    const view = render(<Overlays pageOpen modalOpen />);
    expect(document.body.style.overflow).toBe('hidden');
    view.rerender(<Overlays pageOpen={order !== 'page-first'} modalOpen={order !== 'modal-first'} />);
    expect(document.body.style.overflow).toBe('hidden');
    view.rerender(<Overlays pageOpen={false} modalOpen={false} />);
    expect(document.body.style.overflow).toBe('');
  });

  it('survives repeated transaction modal opens in Strict Mode', () => {
    const view = render(<StrictMode><Overlays pageOpen={false} modalOpen={false} /></StrictMode>);
    for (let i = 0; i < 5; i++) {
      view.rerender(<StrictMode><Overlays pageOpen modalOpen /></StrictMode>);
      expect(document.body.style.overflow).toBe('hidden');
      view.rerender(<StrictMode><Overlays pageOpen={false} modalOpen={false} /></StrictMode>);
      expect(document.body.style.overflow).toBe('');
    }
  });

  it('restores the original overflow when navigating away with overlays open', () => {
    document.body.style.overflow = 'scroll';
    const view = render(<Overlays pageOpen modalOpen />);
    view.unmount();
    expect(document.body.style.overflow).toBe('scroll');
  });
});
