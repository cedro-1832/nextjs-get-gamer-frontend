import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games-App",
  description: "Explora y compra juegos de PS4 y PS5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white dark:bg-black text-black dark:text-white">
        {children}
      </body>
    </html>
  );
}
