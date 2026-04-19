'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const HASH_REGEX = /^[a-f0-9]{64}$/i;

export default function VerifyHashInput() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) {
      setError('Paste a snapshot hash above.');
      return;
    }
    if (!HASH_REGEX.test(trimmed)) {
      setError('A valid Barakah integrity hash is 64 lowercase hex characters (SHA-256).');
      return;
    }
    setError(null);
    router.push(`/verify/${trimmed}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="snapshot-hash" className="block text-sm font-semibold text-gray-900">
        Snapshot hash
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id="snapshot-hash"
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="64-char SHA-256 (e.g. a3f5…)"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'hash-error' : undefined}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 font-mono text-sm focus:border-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20"
        />
        <button
          type="submit"
          className="rounded-xl bg-[#1B5E20] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2E7D32]"
        >
          Verify
        </button>
      </div>
      {error && (
        <p id="hash-error" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
