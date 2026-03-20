'use client';

import { useState, useEffect } from 'react';

export type SDSMode = 'request' | 'link';

export interface SDSLabelSectionProps {
  /** URL for SDS page. Default: /sds (usa il dominio corrente: localhost, lemsolutions.it, ecc.) */
  sdsUrl?: string;
  /** Whether to display the QR code */
  showQr?: boolean;
  /** "request" = "Safety Data Sheet available on request" | "link" = "SDS available at: [URL]" */
  mode: SDSMode;
  /** Optional custom class for the container */
  className?: string;
  /** QR code size in pixels (default: 80) */
  qrSize?: number;
}

export default function SDSLabelSection({
  sdsUrl = '/sds',
  showQr = true,
  mode,
  className = '',
  qrSize = 80,
}: SDSLabelSectionProps) {
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin);
  }, []);

  const fullUrl = sdsUrl.startsWith('http')
    ? sdsUrl
    : `${origin}${sdsUrl.startsWith('/') ? sdsUrl : '/' + sdsUrl}`;
  const shortUrl = fullUrl ? fullUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : '/sds';

  const textContent =
    mode === 'request'
      ? 'Safety Data Sheet available on request'
      : `SDS available at: ${shortUrl}`;

  const qrApiUrl = fullUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(fullUrl)}&margin=2&format=svg`
    : '';

  return (
    <div
      className={`sds-label-section flex flex-col items-center justify-center gap-2 p-2.5 border border-black rounded-sm bg-white print:border-black print:bg-white ${className}`}
      style={{ maxWidth: '140px', minHeight: '100px' }}
    >
      {showQr && qrApiUrl && (
        <div className="sds-label-section__qr flex flex-col items-center gap-0.5">
          <div
            className="sds-label-section__qr-box flex items-center justify-center bg-white p-1.5 rounded-sm border border-black"
            style={{ minWidth: qrSize + 10, minHeight: qrSize + 10 }}
          >
            <img
              src={qrApiUrl}
              alt="QR code for SDS"
              width={qrSize}
              height={qrSize}
              className="block"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <span className="sds-label-section__qr-label text-[8px] font-semibold uppercase tracking-wider text-black">
            Scan for SDS
          </span>
        </div>
      )}

      <p className="sds-label-section__text text-center text-[9px] leading-tight font-medium text-black break-words">
        {textContent}
      </p>
    </div>
  );
}
