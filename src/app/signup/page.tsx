
'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '../../lib/api';

function SignupContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('US');
  const [state, setState] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
      // Fire-and-forget referral click tracking
      api.trackReferralClick(ref).catch(() => {});  // Silent fail is OK for tracking
    }
  }, [searchParams]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const US_STATES = [
    '', 'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
  ];

  // All UN-recognized countries + common territories (195 countries)
  // Sorted alphabetically by country name, using ISO 3166-1 alpha-2 codes
  const COUNTRIES = [
    { code: 'AF', name: 'Afghanistan' },
    { code: 'AL', name: 'Albania' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'AD', name: 'Andorra' },
    { code: 'AO', name: 'Angola' },
    { code: 'AG', name: 'Antigua and Barbuda' },
    { code: 'AR', name: 'Argentina' },
    { code: 'AM', name: 'Armenia' },
    { code: 'AU', name: 'Australia' },
    { code: 'AT', name: 'Austria' },
    { code: 'AZ', name: 'Azerbaijan' },
    { code: 'BS', name: 'Bahamas' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'BB', name: 'Barbados' },
    { code: 'BY', name: 'Belarus' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BZ', name: 'Belize' },
    { code: 'BJ', name: 'Benin' },
    { code: 'BT', name: 'Bhutan' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'BA', name: 'Bosnia and Herzegovina' },
    { code: 'BW', name: 'Botswana' },
    { code: 'BR', name: 'Brazil' },
    { code: 'BN', name: 'Brunei' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'BI', name: 'Burundi' },
    { code: 'KH', name: 'Cambodia' },
    { code: 'CM', name: 'Cameroon' },
    { code: 'CA', name: 'Canada' },
    { code: 'CV', name: 'Cape Verde' },
    { code: 'CF', name: 'Central African Republic' },
    { code: 'TD', name: 'Chad' },
    { code: 'CL', name: 'Chile' },
    { code: 'CN', name: 'China' },
    { code: 'CO', name: 'Colombia' },
    { code: 'KM', name: 'Comoros' },
    { code: 'CG', name: 'Congo' },
    { code: 'CD', name: 'Congo (Democratic Republic)' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'CI', name: 'Côte d\'Ivoire' },
    { code: 'HR', name: 'Croatia' },
    { code: 'CU', name: 'Cuba' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'DK', name: 'Denmark' },
    { code: 'DJ', name: 'Djibouti' },
    { code: 'DM', name: 'Dominica' },
    { code: 'DO', name: 'Dominican Republic' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'EG', name: 'Egypt' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'GQ', name: 'Equatorial Guinea' },
    { code: 'ER', name: 'Eritrea' },
    { code: 'EE', name: 'Estonia' },
    { code: 'SZ', name: 'Eswatini' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' },
    { code: 'GA', name: 'Gabon' },
    { code: 'GM', name: 'Gambia' },
    { code: 'GE', name: 'Georgia' },
    { code: 'DE', name: 'Germany' },
    { code: 'GH', name: 'Ghana' },
    { code: 'GR', name: 'Greece' },
    { code: 'GD', name: 'Grenada' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'GN', name: 'Guinea' },
    { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GY', name: 'Guyana' },
    { code: 'HT', name: 'Haiti' },
    { code: 'HN', name: 'Honduras' },
    { code: 'HU', name: 'Hungary' },
    { code: 'IS', name: 'Iceland' },
    { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'IR', name: 'Iran' },
    { code: 'IQ', name: 'Iraq' },
    { code: 'IE', name: 'Ireland' },
    { code: 'IL', name: 'Israel' },
    { code: 'IT', name: 'Italy' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'JP', name: 'Japan' },
    { code: 'JO', name: 'Jordan' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'KE', name: 'Kenya' },
    { code: 'KI', name: 'Kiribati' },
    { code: 'KP', name: 'Korea (North)' },
    { code: 'KR', name: 'Korea (South)' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'KG', name: 'Kyrgyzstan' },
    { code: 'LA', name: 'Laos' },
    { code: 'LV', name: 'Latvia' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'LS', name: 'Lesotho' },
    { code: 'LR', name: 'Liberia' },
    { code: 'LY', name: 'Libya' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MG', name: 'Madagascar' },
    { code: 'MW', name: 'Malawi' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'MV', name: 'Maldives' },
    { code: 'ML', name: 'Mali' },
    { code: 'MT', name: 'Malta' },
    { code: 'MH', name: 'Marshall Islands' },
    { code: 'MR', name: 'Mauritania' },
    { code: 'MU', name: 'Mauritius' },
    { code: 'MX', name: 'Mexico' },
    { code: 'FM', name: 'Micronesia' },
    { code: 'MD', name: 'Moldova' },
    { code: 'MC', name: 'Monaco' },
    { code: 'MN', name: 'Mongolia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MA', name: 'Morocco' },
    { code: 'MZ', name: 'Mozambique' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'NA', name: 'Namibia' },
    { code: 'NR', name: 'Nauru' },
    { code: 'NP', name: 'Nepal' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'NE', name: 'Niger' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'NO', name: 'Norway' },
    { code: 'OM', name: 'Oman' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'PW', name: 'Palau' },
    { code: 'PS', name: 'Palestine' },
    { code: 'PA', name: 'Panama' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'PE', name: 'Peru' },
    { code: 'PH', name: 'Philippines' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'QA', name: 'Qatar' },
    { code: 'RO', name: 'Romania' },
    { code: 'RU', name: 'Russia' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'KN', name: 'Saint Kitts and Nevis' },
    { code: 'LC', name: 'Saint Lucia' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines' },
    { code: 'WS', name: 'Samoa' },
    { code: 'SM', name: 'San Marino' },
    { code: 'ST', name: 'São Tomé and Príncipe' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'SN', name: 'Senegal' },
    { code: 'RS', name: 'Serbia' },
    { code: 'SC', name: 'Seychelles' },
    { code: 'SL', name: 'Sierra Leone' },
    { code: 'SG', name: 'Singapore' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'SB', name: 'Solomon Islands' },
    { code: 'SO', name: 'Somalia' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'SS', name: 'South Sudan' },
    { code: 'ES', name: 'Spain' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'SD', name: 'Sudan' },
    { code: 'SR', name: 'Suriname' },
    { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SY', name: 'Syria' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'TJ', name: 'Tajikistan' },
    { code: 'TZ', name: 'Tanzania' },
    { code: 'TH', name: 'Thailand' },
    { code: 'TL', name: 'Timor-Leste' },
    { code: 'TG', name: 'Togo' },
    { code: 'TO', name: 'Tonga' },
    { code: 'TT', name: 'Trinidad and Tobago' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'TR', name: 'Turkey' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'TV', name: 'Tuvalu' },
    { code: 'UG', name: 'Uganda' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'VA', name: 'Vatican City' },
    { code: 'VE', name: 'Venezuela' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'YE', name: 'Yemen' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' },
  ];

  // Country dial codes + example phone numbers (ISO 3166-1 alpha-2 → placeholder)
  const PHONE_EXAMPLES: Record<string, string> = {
    AF: '+93 70 123 4567',
    AL: '+355 66 123 4567',
    DZ: '+213 551 23 45 67',
    AD: '+376 312 345',
    AO: '+244 923 123 456',
    AR: '+54 11 1234-5678',
    AM: '+374 77 123456',
    AU: '+61 412 345 678',
    AT: '+43 664 1234567',
    AZ: '+994 50 123 45 67',
    BH: '+973 3612 3456',
    BD: '+880 1712-345678',
    BY: '+375 29 123-45-67',
    BE: '+32 470 12 34 56',
    BJ: '+229 97 12 34 56',
    BO: '+591 7 123 4567',
    BA: '+387 61 123 456',
    BR: '+55 11 91234-5678',
    BN: '+673 712 3456',
    BG: '+359 88 123 4567',
    BF: '+226 70 12 34 56',
    BI: '+257 79 123 456',
    KH: '+855 12 345 678',
    CM: '+237 6 71 23 45 67',
    CA: '+1 (416) 123-4567',
    TD: '+235 66 12 34 56',
    CL: '+56 9 1234 5678',
    CN: '+86 131 2345 6789',
    CO: '+57 310 1234567',
    KM: '+269 321 23 45',
    CD: '+243 81 234 5678',
    CR: '+506 8312 3456',
    CI: '+225 07 12 34 56 78',
    HR: '+385 91 123 4567',
    CY: '+357 96 123456',
    CZ: '+420 601 123 456',
    DK: '+45 20 12 34 56',
    DJ: '+253 77 12 34 56',
    DO: '+1 (809) 123-4567',
    EC: '+593 99 123 4567',
    EG: '+20 100 123 4567',
    SV: '+503 7012 3456',
    ER: '+291 7 123 456',
    EE: '+372 5123 4567',
    ET: '+251 91 123 4567',
    FI: '+358 41 1234567',
    FR: '+33 6 12 34 56 78',
    GA: '+241 06 12 34 56',
    GM: '+220 301 2345',
    GE: '+995 555 12 34 56',
    DE: '+49 151 12345678',
    GH: '+233 24 123 4567',
    GR: '+30 691 234 5678',
    GT: '+502 5123 4567',
    GN: '+224 621 12 34 56',
    GY: '+592 612 3456',
    HT: '+509 34 12 3456',
    HN: '+504 9123-4567',
    HU: '+36 20 123 4567',
    IS: '+354 611 1234',
    IN: '+91 98765 43210',
    ID: '+62 812-3456-7890',
    IR: '+98 912 345 6789',
    IQ: '+964 750 123 4567',
    IE: '+353 85 123 4567',
    IL: '+972 50-123-4567',
    IT: '+39 312 345 6789',
    JM: '+1 (876) 123-4567',
    JP: '+81 90-1234-5678',
    JO: '+962 7 9012 3456',
    KZ: '+7 701 123 4567',
    KE: '+254 712 345678',
    KW: '+965 5012 3456',
    KG: '+996 700 123 456',
    LV: '+371 21 234 567',
    LB: '+961 71 123 456',
    LY: '+218 91-1234567',
    LT: '+370 612 34567',
    LU: '+352 621 123 456',
    MY: '+60 12-345 6789',
    MV: '+960 791-2345',
    ML: '+223 70 12 34 56',
    MT: '+356 9912 3456',
    MR: '+222 22 12 34 56',
    MU: '+230 5251 2345',
    MX: '+52 55 1234 5678',
    MD: '+373 621 12 345',
    MC: '+377 6 12 34 56 78',
    MN: '+976 8812 3456',
    ME: '+382 67 123 456',
    MA: '+212 661-234567',
    MZ: '+258 84 123 4567',
    MM: '+95 9 212 345 678',
    NA: '+264 81 123 4567',
    NP: '+977 984-1234567',
    NL: '+31 6 12345678',
    NZ: '+64 21 123 4567',
    NI: '+505 8123 4567',
    NE: '+227 90 12 34 56',
    NG: '+234 803 123 4567',
    NO: '+47 412 34 567',
    OM: '+968 9212 3456',
    PK: '+92 300 1234567',
    PS: '+970 59-123-4567',
    PA: '+507 6123-4567',
    PY: '+595 981 123456',
    PE: '+51 912 345 678',
    PH: '+63 917 123 4567',
    PL: '+48 512 345 678',
    PT: '+351 912 345 678',
    QA: '+974 3312 3456',
    RO: '+40 721 234 567',
    RU: '+7 912 345-67-89',
    RW: '+250 78 123 4567',
    SA: '+966 50 123 4567',
    SN: '+221 77 123 45 67',
    RS: '+381 61 1234567',
    SL: '+232 76 123456',
    SG: '+65 9123 4567',
    SK: '+421 912 345 678',
    SI: '+386 31 234 567',
    SO: '+252 61 1234567',
    ZA: '+27 71 123 4567',
    SS: '+211 977 123 456',
    ES: '+34 612 34 56 78',
    LK: '+94 71 234 5678',
    SD: '+249 91 123 4567',
    SR: '+597 741-2345',
    SE: '+46 70 123 45 67',
    CH: '+41 78 123 45 67',
    SY: '+963 944 567 890',
    TW: '+886 912 345 678',
    TJ: '+992 91 123 4567',
    TZ: '+255 712 345 678',
    TH: '+66 81 234 5678',
    TG: '+228 90 12 34 56',
    TT: '+1 (868) 123-4567',
    TN: '+216 20 123 456',
    TR: '+90 532 123 45 67',
    TM: '+993 65 123456',
    UG: '+256 772 123456',
    UA: '+380 50 123 4567',
    AE: '+971 50 123 4567',
    GB: '+44 7911 123456',
    US: '+1 (555) 123-4567',
    UY: '+598 94 123 456',
    UZ: '+998 91 123 45 67',
    VE: '+58 412-1234567',
    VN: '+84 91 234 56 78',
    YE: '+967 712 345 678',
    ZM: '+260 97 1234567',
    ZW: '+263 71 234 5678',
  };

  const phonePlaceholder = PHONE_EXAMPLES[country] || `+XX XXX XXX XXXX`;

  const getPasswordStrength = (pwd: string): 'weak' | 'medium' | 'strong' => {
    if (pwd.length < 8) return 'weak';
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    const characterTypeCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (pwd.length >= 12 && characterTypeCount >= 3) return 'strong';
    if (pwd.length >= 8 && characterTypeCount >= 2) return 'medium';
    return 'weak';
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    try {
      const result = await api.signup(name, email, password, state, country, referralCode.trim().toUpperCase() || undefined, phoneNumber.trim() || undefined);
      setEmailSent(result?.emailSent !== false);
      setSignupSuccess(true);
      // Track signup conversion in GA4
      const { trackSignUp } = await import('../../lib/analytics');
      trackSignUp('email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleResend = async () => {
    setResendStatus('sending');
    try {
      await api.resendVerification(email);
      setResendStatus('sent');
    } catch {
      setResendStatus('idle');
    }
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <Link href="/" className="text-3xl font-bold text-[#1B5E20]">&#127769; Barakah</Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-5xl mb-4">{emailSent ? '📧' : '⚠️'}</div>
            <h2 className="text-xl font-bold text-[#1B5E20] mb-2">
              {emailSent ? 'Check Your Email!' : 'Account Created'}
            </h2>
            {emailSent ? (
              <>
                <p className="text-gray-600 mb-2">
                  We sent a verification link to <strong>{email}</strong>.
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Click the link in the email to verify your account, then sign in to choose your starting plan and connect your accounts.
                  Don&apos;t forget to check your spam folder!
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-2">
                  Your account was created, but we had trouble sending the verification email.
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Please click &ldquo;Resend&rdquo; below to try again. Once you&apos;re verified, sign in to choose your plan and connect your accounts.
                </p>
              </>
            )}

            <div className="mb-4 rounded-xl bg-[#FFF3CD] text-[#1B5E20] text-sm font-medium px-4 py-3">
              After sign in, Barakah will guide you through plan choice, secure account connection, and your first dashboard focus.
            </div>

            {resendStatus === 'sent' ? (
              <p className="text-green-700 text-sm mb-4">✅ Verification email resent!</p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendStatus === 'sending'}
                className="w-full mb-3 border border-[#1B5E20] text-[#1B5E20] py-2.5 rounded-lg text-sm font-semibold hover:bg-green-50 transition disabled:opacity-50"
              >
                {resendStatus === 'sending' ? 'Sending...' : 'Resend Verification Email'}
              </button>
            )}

            <Link
              href="/login"
              className="inline-block w-full bg-[#1B5E20] text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Continue to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-bold text-[#1B5E20]">&#127769; Barakah</Link>
          <p className="text-gray-600 mt-3 font-semibold">Create your account &mdash; get 7 days of Plus on us</p>
          <p className="text-xs text-gray-500 mt-2">No credit card &middot; Zakat calculator &middot; Bank sync &middot; Halal screener</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none transition"
              placeholder="Your full name"
              maxLength={255}
              required
              aria-label="Full name"
              autoComplete="name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none transition"
              placeholder="you@example.com"
              maxLength={254}
              required
              aria-label="Email address"
              autoComplete="email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none transition"
              placeholder="At least 8 characters"
              minLength={8}
              maxLength={256}
              required
              aria-label="Password"
              autoComplete="new-password"
            />
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs text-gray-500">At least 8 characters</p>
              {password && (
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className={`w-1 h-1 rounded-full ${passwordStrength === 'weak' || passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-red-500' : 'bg-gray-300'}`} />
                    <div className={`w-1 h-1 rounded-full ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                    <div className={`w-1 h-1 rounded-full ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength === 'weak' ? 'text-red-500' : passwordStrength === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {passwordStrength === 'weak' ? 'Weak' : passwordStrength === 'medium' ? 'Medium' : 'Strong'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition focus:ring-1 ${confirmPassword && password !== confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#1B5E20] focus:ring-[#1B5E20]'}`}
              placeholder="Re-enter your password"
              minLength={8}
              required
              autoComplete="new-password"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={country}
              onChange={e => { setCountry(e.target.value); setState(''); }}
              className="w-full border rounded-lg px-3 py-2 text-gray-900"
              required
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          {country === 'US' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-gray-400 font-normal">(for tax estimate)</span>
              </label>
              <select value={state} onChange={e => setState(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                {US_STATES.map((s) => (<option key={s} value={s}>{s ? s : 'Select your state'}</option>))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              placeholder={phonePlaceholder}
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              required
              maxLength={20}
              className="w-full border rounded-lg px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
            />
            <p className="text-xs text-gray-400 mt-1">For customer support — we&apos;ll never spam you.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referral code <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ABCD1234"
              value={referralCode}
              onChange={e => setReferralCode(e.target.value.toUpperCase())}
              maxLength={8}
              className="w-full border rounded-lg px-3 py-2 text-gray-900 font-mono uppercase placeholder:normal-case placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
            />
            <p className="text-xs text-gray-400 mt-1">Have a friend&apos;s code? Both of you get 1 free month of Plus. 🎁</p>
          </div>

          <p className="text-center text-xs text-gray-600 mb-6">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-[#1B5E20] hover:underline font-medium">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[#1B5E20] hover:underline font-medium">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B5E20] text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1B5E20] font-semibold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div />}>
      <SignupContent />
    </Suspense>
  );
}
