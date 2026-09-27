import "./globals.css";

export const metadata = {
  title: "Bangla hot group",
  description: "Facebook Messenger Clone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
