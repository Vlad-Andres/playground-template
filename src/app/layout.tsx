import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { staticSite } from "@site/content/static";
import { CONTENT_SECURITY_POLICY } from "@site/lib/security";
import { themeBootstrapScript } from "@site/lib/theme";
import { themeCss } from "@site/lib/theme-css";
import { SiteShell } from "@site/screens/SiteShell";

const course = staticSite.course;

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
  const courseThemeCss = themeCss(course.theme);

  return (
    <html lang={course.language} suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "production" ? (
          <meta httpEquiv="Content-Security-Policy" content={CONTENT_SECURITY_POLICY} />
        ) : null}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript(staticSite.key) }} />
        {courseThemeCss ? <style dangerouslySetInnerHTML={{ __html: courseThemeCss }} /> : null}
      </head>
      <body className="flex min-h-screen flex-col">
        <SiteShell data={staticSite} base="">
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
