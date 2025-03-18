import type { Metadata } from "next";
import "./globals.css";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import ThemeRegistry from "./components/ThemeRegistry"; // Import the Theme Provider

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <ResponsiveAppBar>
            {children} {/* Pass children to ResponsiveAppBar */}
          </ResponsiveAppBar>
        </ThemeRegistry>
      </body>
    </html>
  );
}