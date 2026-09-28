import "./globals.css";

export const metadata = {
  title: "Bangla hot group",
  description: "বাংলা ভিডিও গ্রুপ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
