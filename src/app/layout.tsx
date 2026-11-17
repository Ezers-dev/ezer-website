import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { MotionProvider } from "@/components/MotionProvider";
import { site } from "@/data/site";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Creative Agency`,
    template: `%s — ${site.name}`,
  },
  description:
    "You’ve got the ambition. We’ll make the market see it. Communication strategy, branding and design, corporate storytelling, content and social media, from Nigeria and Canada.",
  keywords: [
    "creative agency",
    "branding",
    "brand identity",
    "communication strategy",
    "corporate storytelling",
    "social media management",
    "content creation",
    "Nigeria",
    "Canada",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description:
      "Communication strategy, branding, storytelling, content and social media for ambitious brands. 25+ clients, 12+ years, two continents.",
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} antialiased`}>
      <body className="flex min-h-svh flex-col">
        <MotionProvider>
          <SmoothScroll />
          <a
            href="#main"
            className="pill sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
