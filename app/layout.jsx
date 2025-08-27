export const metadata = {
  title: "Broom Marketplace",
  description: "Marketplace demo powered by Next.js + Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen text-white">{children}</body>
    </html>
  );
}
