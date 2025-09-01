import './globals.css';
import type { Metadata } from 'next';
import {  Gentium_Book_Plus , Arimo, Carlito} from 'next/font/google';

import ClientProviders from './ClientProvider';
const inter = Carlito({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const font1 = Gentium_Book_Plus({
  style: ['normal'],
weight: ['400',  '700'],
  subsets: ['latin'],
  variable: '--font-font1',

})



export const font2 = Arimo({
  style: ['normal'],
weight: ['400',  '700'],
  subsets: ['latin'],
  variable: '--font-font2',

})


export const metadata: Metadata = {
  title: 'askMe | your voice online',
  description: ' your voice online',
  icons: [{ rel: 'icon', url: "/faviconPNG.png" }],

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" sizes="any" />

    <body className={`${inter.className} ${font1.variable} ${font2.variable}  dark`}>
      {/* Wrap the children with the client-side providers */}
      <ClientProviders>{children}</ClientProviders>
    </body>
  </html>
  );
}