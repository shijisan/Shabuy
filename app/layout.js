import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Shabuy",
  description: "Shop And Buy!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="h-screen">
          <Navbar/>
          {children}
          {/* footer */}
        </main>
      </body>
    </html>
  );
}
