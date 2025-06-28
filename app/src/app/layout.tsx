'use client'

import '../css/main.css'
import {ReactNode} from 'react'
import {Provider} from 'react-redux'
import {store} from '../stores/store'
import Head from 'next/head'
import LayoutAuthenticated from '@/layouts/Authenticated'
import {DeleteConfirmationProvider} from '@/components/DeleteConfirmationProvider'

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/admin-one-react-tailwind/favicon.png" />
      </Head>
      <body>
        <Provider store={store}>
          <DeleteConfirmationProvider>
            <LayoutAuthenticated>{children}</LayoutAuthenticated>
          </DeleteConfirmationProvider>
        </Provider>
      </body>
    </html>
  )
}
