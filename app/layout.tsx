import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Generate Your Dad',
  description: 'Generate Your Dad',
  generator: 'skillerr',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
