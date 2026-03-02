import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutContent from '@/components/LayoutContent';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://samuelsakamoto.adv.br'
  ),
  title: {
    default:
      'Samuel Sakamoto | Sociedade de Advogados em Presidente Prudente - SP',
    template: '%s | Samuel Sakamoto Sociedade de Advogados',
  },
  description:
    'Samuel Sakamoto Sociedade de Advogados – Escritório de Advocacia em Presidente Prudente, SP. Quase três décadas de atuação em Direito do Trabalho, Família e Sucessões, Previdenciário, Consumidor e Licitações Públicas.',
  keywords: [
    'Samuel Sakamoto',
    'escritório de advocacia Presidente Prudente',
    'direito do trabalho',
    'direito de família e sucessões',
    'direito previdenciário',
    'direito do consumidor',
    'licitação pública',
    'advogado Presidente Prudente',
    'advogado SP',
  ],
  authors: [{ name: 'Samuel Sakamoto Sociedade de Advogados' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Samuel Sakamoto Sociedade de Advogados',
    title: 'Samuel Sakamoto | Sociedade de Advogados em Presidente Prudente - SP',
    description:
      'Escritório de Advocacia em Presidente Prudente. Quase 30 anos de tradição em Direito do Trabalho, Família e Sucessões, Previdenciário, Consumidor e Licitações Públicas.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'JdhatxU36ZDViOKcIKyHf89T9AhWbUJ2Va_v5Kc5yFA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0b1223" />
      </head>
      <body className="min-h-screen flex flex-col">
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
