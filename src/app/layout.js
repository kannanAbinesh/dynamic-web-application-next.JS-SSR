/* Plugins. */
import { Lexend } from "next/font/google";

/* Helpers. */
import { Providers } from "./providers";
import { ThemeProvider } from "@/configurations/theme";

/* Styles. */
import "./globals.css";

/* Variables declarations. */
const lexend = Lexend({ subsets: ["latin"], display: "swap" });
export const metadata = { title: "my-app", description: "My app" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lexend.className}>
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
};