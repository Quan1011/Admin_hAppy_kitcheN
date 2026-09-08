import { useState } from 'react';

export default function CountryFlag({ 
  countryCode, 
  className = "w-5 h-3.5 object-cover rounded-xs border border-gray-200/60 shadow-xs inline-block shrink-0", 
  alt = "" 
}) {
  const [hasError, setHasError] = useState(false);

  if (!countryCode || countryCode.toUpperCase() === 'UNKNOWN' || hasError) {
    return <span className="text-base leading-none select-none">🌐</span>;
  }

  const code = countryCode.trim().toLowerCase();

  // Kiểm tra mã ISO 2 ký tự chuẩn
  if (code.length !== 2) {
    return <span className="text-base leading-none select-none">🌐</span>;
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      alt={alt || countryCode}
      width="20"
      height="14"
      loading="lazy"
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
