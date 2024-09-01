import "./globals.css";

export const metadata = {
  title: "Shabuy",
  description: "Shop And Buy!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* nav */}
        {children}
        {/* footer */}
        </body>
    </html>
  );
}
