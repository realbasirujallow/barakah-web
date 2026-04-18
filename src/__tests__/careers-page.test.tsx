import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CareersPage from '../components/CareersPage';

const { submitCareerApplicationMock } = vi.hoisted(() => ({
  submitCareerApplicationMock: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: ComponentPropsWithoutRef<'a'> & { href: string; children: ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('../lib/careers', () => ({
  submitCareerApplication: submitCareerApplicationMock,
}));

describe('CareersPage', () => {
  beforeEach(() => {
    submitCareerApplicationMock.mockReset();
  });

  it('keeps submit disabled until the applicant adds a note or resume', () => {
    render(<CareersPage />);

    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: 'Basiru Jallow' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'basiru@example.com' },
    });

    expect(screen.getByRole('button', { name: /submit application/i })).toBeDisabled();
    expect(submitCareerApplicationMock).not.toHaveBeenCalled();
  });

  it('submits a free-form application and shows success state', async () => {
    submitCareerApplicationMock.mockResolvedValueOnce({ success: true });

    render(<CareersPage />);

    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: 'Basiru Jallow' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'basiru@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/free-form application note/i), {
      target: { value: 'I build educational short-form content and founder-led edits.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit application/i }));

    await waitFor(() => {
      expect(submitCareerApplicationMock).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Basiru Jallow',
        email: 'basiru@example.com',
        note: 'I build educational short-form content and founder-led edits.',
      }));
    });

    expect(await screen.findByText(/Application received/i)).toBeInTheDocument();
  });
});
