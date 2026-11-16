import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { staticSite } from "@site/content/static";
import { CONTENT_SECURITY_POLICY } from "@site/lib/security";
import { themeBootstrapScript } from "@site/lib/theme";
import { SiteShell } from "@site/screens/SiteShell";

const course = staticSite.course;

// Self-hosted at build time; the portal sets the same variables, so course pages look alike in both.
const sans = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-grotesk", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin", "latin-ext"], weight: "400", style: ["italic", "normal"], variable: "--font-instrument", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: course.title,
    template: `%s · ${course.title}`,
  },
  description: course.description,
  ...(course.indexable ? {} : { robots: { index: false, follow: false } }),
  appleWebApp: {
    capable: true,
    title: course.shortTitle,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang={course.language} className={`${sans.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "production" ? (
          <meta httpEquiv="Content-Security-Policy" content={CONTENT_SECURITY_POLICY} />
        ) : null}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript(staticSite.key) }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <SiteShell data={staticSite} base="">
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
