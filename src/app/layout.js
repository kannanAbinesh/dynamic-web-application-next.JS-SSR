/* Plugins. */
import { Lexend } from "next/font/google";
import { Provider } from "react-redux";

/* Helpers. */
// import Store from '@/reducers'

/* Styles. */
import "./globals.css";

/* Variables declarations. */
const lexend = Lexend({ subsets: ["latin"], display: "swap" });
export const metadata = { title: "my-app", description: "My app" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lexend.className}>
        {/* <Provider store={Store}> */}
          {children}
        {/* </Provider> */}
      </body>
    </html>
  );
}