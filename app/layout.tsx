import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import OwlMascot from "@/components/chatbot/OwlMascot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ieee-cs-hkbk.vercel.app"),
  title: {
    default: "IEEE Computer Society | HKBK College of Engineering",
    template: "%s | IEEE CS HKBK",
  },
  description:
    "Official website of the IEEE Computer Society Student Chapter at HKBK College of Engineering. Join us for technical workshops, hackathons, seminars, and professional development opportunities in computing and technology.",
  keywords: [
    "IEEE",
    "Computer Society",
    "Student Chapter",
    "HKBK College",
    "Technology",
    "Engineering",
    "Hackathons",
    "Workshops",
    "Bangalore",
    "Computing",
    "Programming",
    "Technical Events",
  ],
  authors: [
    {
      name: "IEEE Computer Society HKBK",
      url: "https://ieee-cs-hkbk.vercel.app",
    },
  ],
  creator: "IEEE Computer Society HKBK",
  publisher: "IEEE Computer Society HKBK",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ieee-cs-hkbk.vercel.app",
    siteName: "IEEE Computer Society HKBK",
    title: "IEEE Computer Society | HKBK College of Engineering",
    description:
      "Official website of the IEEE Computer Society Student Chapter at HKBK College of Engineering. Join us for technical workshops, hackathons, and professional development.",
    images: [
      {
        url: "/assets/college-emblem.png",
        width: 1200,
        height: 630,
        alt: "IEEE Computer Society HKBK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IEEE Computer Society | HKBK College of Engineering",
    description:
      "Official website of the IEEE Computer Society Student Chapter at HKBK College of Engineering.",
    images: ["/assets/college-emblem.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IEEE Computer Society HKBK",
    url: "https://ieee-cs-hkbk.vercel.app",
    logo: "https://ieee-cs-hkbk.vercel.app/assets/college-emblem.png",
    description:
      "IEEE Computer Society Student Chapter at HKBK College of Engineering, Bangalore",
    address: {
      "@type": "PostalAddress",
      streetAddress: "HKBK College of Engineering",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    sameAs: [
      // Add social media links when available
      // "https://www.facebook.com/ieee-cs-hkbk",
      // "https://www.linkedin.com/company/ieee-cs-hkbk",
      // "https://twitter.com/ieee_cs_hkbk",
    ],
  };

  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`} suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <OwlMascot />
      </body>
    </html>
  );
}
