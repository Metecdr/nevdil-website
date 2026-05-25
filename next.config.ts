import type { NextConfig } from "next";

const securityHeaders = [
  // Clickjacking koruması — site iframe içine alınamaz
  { key: "X-Frame-Options", value: "DENY" },
  // Tarayıcı MIME sniffing yapamaz
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer bilgisi minimum seviyede paylaşılır
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Kamera, mikrofon, konum erişimi tamamen kapalı
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HTTPS zorunlu (domain bağlandıktan sonra aktif olur)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // XSS & injection koruması — kaynakları kısıtla
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js zorunlu
      "style-src 'self' 'unsafe-inline'",                // Tailwind zorunlu
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // Hata detaylarını production'da gizle
  productionBrowserSourceMaps: false,
};

export default nextConfig;
