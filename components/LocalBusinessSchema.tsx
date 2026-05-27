/**
 * Google'ın anlayacağı LocalBusiness JSON-LD yapısı.
 * Arama sonuçlarında adres, saat ve telefon bilgisi gösterir.
 */
export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LanguageSchool",
    name: "Nev-Dil Yabancı Dil Kursu",
    alternateName: "Nev-Dil",
    url: "https://nevdil.com",
    logo: "https://nevdil.com/logo.png",
    image: "https://nevdil.com/logo.png",
    description:
      "Nevşehir'in öncü İngilizce kursu. BEDAF yetkili kurum. YDS hazırlık, İş İngilizcesi, Junior ve çocuk grupları.",
    foundingDate: "2021-10-02",
    telephone: "+90-537-428-76-40",
    address: {
      "@type": "PostalAddress",
      streetAddress: "15 Temmuz Mah. 154. Sok. No:6B, 2000 Evler",
      addressLocality: "Merkez",
      addressRegion: "Nevşehir",
      postalCode: "50000",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      // Nevşehir merkez koordinatları (yaklaşık)
      latitude: 38.6239,
      longitude: 34.7239,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "10:00",
        closes: "17:00",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90-537-428-76-40",
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
    },
    sameAs: [],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "İngilizce Kursları",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: "YDS Hazırlık Grubu",
            description: "Üniversite öğrencileri için YDS sınav hazırlık kursu",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: "İş İngilizcesi",
            description: "Profesyoneller için iş hayatında kullanılan İngilizce",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: "Junior Grubu",
            description: "4–6 yaş arası çocuklar için oyun temelli İngilizce",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: "İlkokul Grubu",
            description: "1–4. sınıf öğrencileri için akran grubu İngilizce",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: "Ortaokul Grubu",
            description: "5–7. sınıf öğrencileri için İngilizce",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: "Lise Grubu",
            description: "9–12. sınıf öğrencileri için A1–B2 İngilizce",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
