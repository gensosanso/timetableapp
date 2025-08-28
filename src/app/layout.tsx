import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { BookOpen, Users } from "lucide-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Système de Gestion d'Emplois du Temps",
  description:
    "Application de gestion d'emplois du temps pour écoles primaires",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempo.build/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <header className="border-b bg-card">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-2xl font-bold hover:text-primary transition-colors"
              >
                Emploi du Temps Scolaire
              </Link>
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Matières
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem asChild>
                      <Link href="/matiere" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Gérer les matières
                      </Link>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Enseignants
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem asChild>
                      <Link
                        href="/enseignant"
                        className="flex items-center gap-2"
                      >
                        <Users className="h-4 w-4" />
                        Gérer les enseignants
                      </Link>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>
        </header>
        {children}
        <TempoInit />
      </body>
    </html>
  );
}
