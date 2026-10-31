import "./globals.css";

export const metadata = {
  title: "WALKZY | Your neighbourhood, your walk, your delivery",
  description: "Community-powered hyperlocal delivery."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
