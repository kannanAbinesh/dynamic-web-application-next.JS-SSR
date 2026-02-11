/* Plugins. */
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

/* Variable declarations. */
export const metadata = { title: "My app", description: "My app" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
};