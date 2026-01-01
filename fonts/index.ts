import { Inter, Nunito, Playfair_Display, VT323 } from "next/font/google";

export const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-sans",
})


export const inter = Inter({
  subsets: ["latin"],
})
export const playfair = Playfair_Display({
  subsets: ["latin"],
})