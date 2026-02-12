import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import Providers from '@/components/providers/session-provider'
import { SuperuserMenu } from '@/components/superuser-menu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Job Matching Platform',
  description: 'Platform for matching jobs with job seekers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <Providers>
          {children}
          <SuperuserMenu />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
