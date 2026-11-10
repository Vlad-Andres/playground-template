import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ServiceWorkerRegistration } from "@/components/layout/ServiceWorkerRegistration";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { lectureIndex, lectureMetas } from "@/content/registry";
import { buildSearchRecords } from "@/lib/search";
import { CONTENT_SECURITY_POLICY } from "@/lib/security";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";
import { course } from "@/content/course";

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
  const records = buildSearchRecords(lectureIndex);

  return (
    <html lang={course.language} suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "production" ? (
          <meta httpEquiv="Content-Security-Policy" content={CONTENT_SECURITY_POLICY} />
        ) : null}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-ink"
        >
          Skip to content
        </a>
        <SiteHeader metas={lectureMetas} records={records} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
