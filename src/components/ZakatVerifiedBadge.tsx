import Link from 'next/link';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  mosqueName?: string;
  size?: Size;
  href?: string;
  className?: string;
};

const sizeClasses: Record<Size, { wrapper: string; icon: string; label: string; sub: string }> = {
  sm: {
    wrapper: 'gap-1.5 px-2.5 py-1 text-xs',
    icon: 'h-3.5 w-3.5',
    label: 'text-xs font-semibold',
    sub: 'text-[10px]',
  },
  md: {
    wrapper: 'gap-2 px-3 py-1.5 text-sm',
    icon: 'h-4 w-4',
    label: 'text-sm font-semibold',
    sub: 'text-xs',
  },
  lg: {
    wrapper: 'gap-2.5 px-4 py-2 text-base',
    icon: 'h-5 w-5',
    label: 'text-base font-bold',
    sub: 'text-sm',
  },
};

export default function ZakatVerifiedBadge({
  mosqueName,
  size = 'md',
  href = '/methodology',
  className = '',
}: Props) {
  const s = sizeClasses[size];
  const content = (
    <span
      className={`inline-flex items-center rounded-full border border-[#1B5E20] bg-white text-[#1B5E20] ${s.wrapper} ${className}`}
      role="img"
      aria-label={`Zakat Verified${mosqueName ? ` by ${mosqueName}` : ''}`}
    >
      <svg
        className={s.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className={s.label}>Zakat Verified</span>
        {mosqueName && <span className={`${s.sub} font-normal text-gray-600`}>by {mosqueName}</span>}
      </span>
    </span>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
