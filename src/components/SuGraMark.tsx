interface SuGraMarkProps {
  size?: number;
  className?: string;
}

export default function SuGraMark({ size = 34, className = '' }: SuGraMarkProps) {
  return (
    <svg
      className={`sugra-mark ${className}`}
      width={size}
      height={size}
      viewBox="0 0 44 44"
      role="img"
      aria-label="SUGRA mark"
    >
      <defs>
        <linearGradient id="sugra-orb-gradient" x1="6" y1="4" x2="38" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB1EF" />
          <stop offset="0.48" stopColor="#EF48D8" />
          <stop offset="1" stopColor="#7428CF" />
        </linearGradient>
        <linearGradient id="sugra-eye-gradient" x1="11" y1="18" x2="33" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E6D6F2" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="19.5" fill="#160D1D" stroke="url(#sugra-orb-gradient)" strokeWidth="1.7" />
      <circle cx="22" cy="22" r="15.5" fill="url(#sugra-orb-gradient)" opacity=".88" />
      <path d="M8.5 22c3.5-5.5 8-8.25 13.5-8.25s10 2.75 13.5 8.25c-3.5 5.5-8 8.25-13.5 8.25S12 27.5 8.5 22Z" fill="url(#sugra-eye-gradient)" />
      <circle cx="22" cy="22" r="5.4" fill="#31113D" />
      <circle cx="23.8" cy="20.2" r="1.65" fill="#FFF" />
      <circle cx="35.8" cy="9.3" r="2.2" fill="#FFF" />
    </svg>
  );
}
