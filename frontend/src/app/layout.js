import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/AuthContext";
import { SITE } from "@/lib/site";

export const metadata = {
  title: {
    default: `${SITE.title} | ${SITE.org}`,
    template: `%s | ${SITE.org} Sustainability`,
  },
  description: SITE.tagline,
  icons: { icon: "/images/favicon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <a href="#main" className="srOnly">Skip to content</a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}