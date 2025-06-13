export const OracynLogo = () => (
  <div className="relative w-8 h-8 group cursor-pointer">
    <svg
      className="absolute w-full h-full text-sky-400 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
    <svg
      className="absolute w-full h-full text-sky-400 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.98l1.414 1.414M18.6 8.98l-1.414 1.414M12 6V4M12 20v-2M4.929 14.071l1.414-1.414M17.171 14.071l1.414 1.414"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 16s1.79-2 5-2 5 2 5 2"
      />
    </svg>
  </div>
);

const MultiFormatIcon = () => (
  <div className="relative h-10 w-10 text-blue-400">
    <svg
      className="w-full h-full"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15v-6m0 0l-3 3m3-3l3 3"
      />
    </svg>
    <svg
      className="absolute -top-1 -right-1 h-5 w-5 animate-hop"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  </div>
);
const AIPoweredIcon = () => (
  <div className="relative h-10 w-10 text-pink-400">
    <svg
      className="w-full h-full"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.871 4.22c4.418-2.36 9.82-2.36 14.238 0l.28.148a2.15 2.15 0 011.083 1.82V18.5a2.15 2.15 0 01-2.15 2.15h-1.58a2.15 2.15 0 00-2.15 2.15v.215a2.15 2.15 0 01-2.15 2.15h-2.22a2.15 2.15 0 01-2.15-2.15V22.8a2.15 2.15 0 00-2.15-2.15h-1.58A2.15 2.15 0 012.5 18.5V6.188a2.15 2.15 0 011.083-1.82l.28-.148z"
      />
    </svg>
    <svg
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 animate-color-change"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M5 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v1a1 1 0 002 0V6h1a1 1 0 000-2H6V3a1 1 0 00-1-1zm11 1a1 1 0 00-1 1v1h-1a1 1 0 000 2h1v1a1 1 0 002 0V6h1a1 1 0 000-2h-1V3a1 1 0 00-1-1zM5 11a1 1 0 00-1 1v1H3a1 1 0 000 2h1v1a1 1 0 002 0v-1h1a1 1 0 000-2H6v-1a1 1 0 00-1-1zm11 1a1 1 0 00-1 1v1h-1a1 1 0 000 2h1v1a1 1 0 002 0v-1h1a1 1 0 000-2h-1v-1a1 1 0 00-1-1z"></path>
    </svg>
  </div>
);
const LightningFastIcon = () => (
  <div className="h-10 w-10 text-yellow-400">
    <svg
      className="w-full h-full animate-lightning"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  </div>
);
const SecurePrivateIcon = () => (
  <div className="relative h-10 w-10 text-sky-400">
    <svg
      className="w-full h-full"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 21a12.02 12.02 0 009-14.056z"
      />
    </svg>
    <div className="absolute -top-1 -right-1 h-5 w-5 animate-lock-key text-amber-400">
      <svg
        className="absolute -bottom-1 -right-1 h-3 w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17.5V21h-2v-3.5l-1.257-.757A6 6 0 016 12a6 6 0 016-6zM12 15a2 2 0 100-4 2 2 0 000 4z"
        />
      </svg>
      <svg
        className="absolute h-full w-full"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    </div>
  </div>
);
export const ChartIcons = {
  Bar: () => (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      ></path>
    </svg>
  ),
  Line: () => (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 15l4-4 6 6 10-10"
      ></path>
    </svg>
  ),
  Pie: () => (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 15.232A9 9 0 1115.232 3M9 12a9 9 0 009 9"
      ></path>
    </svg>
  ),
  Scatter: () => (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
      ></path>
    </svg>
  ),
  Area: () => (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 16l4-4 6 6 10-10v10H4z"
      ></path>
    </svg>
  ),
};
const UserIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    ></path>
  </svg>
);
const LockIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    ></path>
  </svg>
);

const MailIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    ></path>
  </svg>
);

export {
  MultiFormatIcon,
  AIPoweredIcon,
  LightningFastIcon,
  SecurePrivateIcon,
  UserIcon,
  LockIcon,
  MailIcon,
};
