import ThemeProvider from '../components/ThemeProvider';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../app/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nextcar | Premium Curated Fleet',
  description: 'The car that will save your time and money is just a few clicks away.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-[#f8f9fa] dark:bg-[#0f1115] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider>
          {/* Centered Main Wrapper */}
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row relative bg-white dark:bg-[#0a0c10] shadow-sm min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-h-screen border-l border-slate-100 dark:border-slate-800/50 relative">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
