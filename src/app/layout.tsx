import "~/styles/globals.css"
import React from "react"

import {
  GeistSans,
} from "geist/font/sans"
import {
  type Metadata,
} from "next"

export const metadata: Metadata = {
  title: {
    default: "Auto Ranker",
    template: "%s - Auto Ranker",
  },
  description: "",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
  ],
}

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={GeistSans.variable}>
        {children}
      </body>
    </html>
  )
}
