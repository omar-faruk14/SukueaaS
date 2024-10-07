import localFont from "next/font/local";
import "./globals.css";
import BootstrapClient from "@Om/components/BootstrapClient";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "@Om/components/HeaderandFooter/Footer";
import Header from "@Om/components/HeaderandFooter/Header";
//import Footer2 from "@Om/components/HeaderandFooter/Footer2";




const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "つくえらぼテスト用",
  description: "つくえらぼテスト用",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        // style={{ backgroundColor: "lightblue" }}
      >
        <Header/>
        {children}

        <Footer />
        

        <BootstrapClient />
      </body>
    </html>
  );
}
