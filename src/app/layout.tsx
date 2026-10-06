import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00629E",
};

export const metadata: Metadata = {
  title: "Quiz Administração Sem Limites | FUMEC",
  description:
    "Descubra quais áreas da Administração têm maior afinidade com o seu perfil profissional.",
  icons: {
    icon: "/fumec_icon.png",
    apple: "/fumec_icon.png",
  },
  openGraph: {
    title: "Quiz Administração Sem Limites | FUMEC",
    description:
      "Descubra quais áreas da Administração têm maior afinidade com o seu perfil profissional.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-fumec-surface text-fumec-navy font-sans">
        {children}
      </body>
    </html>
  );
}
