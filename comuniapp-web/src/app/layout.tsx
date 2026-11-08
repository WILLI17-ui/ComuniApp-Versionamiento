import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "ComuniApp · Emprendimientos de tu conjunto", template: "%s · ComuniApp" },
  description:
    "Encuentra productos y servicios de los emprendedores de Ciudad La Salle Galet y contáctalos por WhatsApp.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1E7A4C" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
            Saltar al contenido
          </a>
          <Header />
          <main id="contenido" className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
