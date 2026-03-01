import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import SidebarWithData from '@/components/SidebarWithData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import LocaleHtmlAttr from '@/components/LocaleHtmlAttr';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return {
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `/${loc}`])
      ),
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtmlAttr />
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row relative bg-white shadow-sm min-h-screen">
        <SidebarWithData />
        <div className="flex-1 flex flex-col min-h-screen border-l border-slate-100 relative">
          <Header />
          {children}
          <Footer />
          <ContactModal />
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
