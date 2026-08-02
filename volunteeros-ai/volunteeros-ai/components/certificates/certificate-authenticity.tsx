/**
 * Anti-duplication marks for a certificate: a faint tiled watermark of its ID
 * across the background, and a small QR + ID block for verification.
 *
 * The QR is rendered via api.qrserver.com's free, no-auth image endpoint —
 * no new npm dependency, but the certificate ID and volunteer name are sent
 * to that third-party service to generate the image. Swap qrSrc() for a
 * server-rendered QR (e.g. the `qrcode` package behind an API route) if that
 * shouldn't leave the browser.
 */
export function verifyUrl(certificateId: string) {
  return `https://volunteeros.ai/verify/${certificateId}`;
}

export function qrSrc(certificateId: string) {
  const data = encodeURIComponent(verifyUrl(certificateId));
  return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=0&data=${data}`;
}

/** Faint, tiled, diagonal repeat of the certificate ID — sits behind the content. */
export function CertificateWatermark({ certificateId }: { certificateId: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
      <div className="absolute inset-[-20%] flex -rotate-[22deg] flex-wrap content-around justify-around gap-x-6 gap-y-4 opacity-[0.07] dark:opacity-[0.09]">
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-espresso-900 dark:text-crema-50"
          >
            VolunteerOS · {certificateId}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Small "scan to verify" block — QR code, ID, and the check URL. */
export function CertificateVerifyBlock({ certificateId }: { certificateId: string }) {
  return (
    <div className="relative mt-4 flex items-center justify-center gap-3 border-t border-espresso-200/60 pt-4 dark:border-white/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrSrc(certificateId)}
        alt={`QR code to verify certificate ${certificateId}`}
        width={56}
        height={56}
        className="shrink-0 rounded-md border border-espresso-200 bg-white p-1 dark:border-white/10"
      />
      <div className="text-left">
        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Verify authenticity
        </div>
        <div className="font-mono text-xs text-foreground">{certificateId}</div>
        <div className="text-[10px] text-muted-foreground">volunteeros.ai/verify</div>
      </div>
    </div>
  );
}
