
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CarCard from './components/CarCard';
import Footer from './components/Footer';
import { Car } from './types';

const INITIAL_CARS: Car[] = [
  {
    id: '1',
    title: '530d xDrive Sedan',
    description: 'A masterpiece of German engineering, featuring the M-Sport package and premium Merino leather interior. Perfect for both business travel and weekend escapes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgE_-Xc8tEgqONJceD8Eco2OmyHPjT0FhEBEEhszZ0W-koxHhn2AyK4df30Jqv6jwfLSEyixrIKdec2BSWcXXxtm7LrpU9DDFChxQ6Ov6wgu51myYcdY47BXFD1-YK1q0944uGMEmwcT5r0coAl1aGWFcoYlvRuGUd4seXvFV6RhTQcCQbLGjo99BFBDq_zah-yKPEeOj1VWKUCz0oY_83aLJROYub8bUzGQloTxKDfCpBu5nij2bE74CjPhEVo438aLKEAZpViAY',
    specs: {
      engine: '3.0L Diesel',
      gearbox: 'Automatic',
      mileage: '42,000 km'
    },
    tags: ['New Arrival', 'Full Service History']
  },
  {
    id: '2',
    title: 'Carrera S Coupe',
    description: 'The gold standard of sports cars. Presented in GT Silver Metallic with a classic black interior and 20/21-inch Carrera Exclusive Design wheels.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9XE1sqFcAaVvUj3rm9QkFDPLIOe1R1oED4AwuXQonzsYX4fHbjhgQunh-vITLIBLXMMiOtEqrO5FKsUe9KdvxbZqy0YTIP0p9m4brSjJftSlW85z_AzwfYQCySEFQfSxPsI_PeJKscOAjIugtaDIyWKDSPBLw8H6KPS6p85NYv0zonrd58Cgqho4wPeduRKJCKwrkAQ_K7tZZsD9syhMu6kHiqj7EaSsfn6Y7LS72eE784Xase80XNcAmQT-jO8DX7UKsrWjQsKo',
    specs: {
      engine: '3.0L Petrol',
      gearbox: 'PDK 8-speed',
      mileage: '12,500 km'
    },
    tags: ['Certified Pre-Owned']
  },
  {
    id: '3',
    title: 'Performance Edition RS',
    description: 'Uncompromising power and elegance. This Nardo Grey beast offers 630hp and a sophisticated all-wheel-drive system for maximum control.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgdat8YtWwoeLNTodT_sks-T9l202S5hzgp37DyvtTV_MzUiNj6xnm5Rz61IPKRHD9OOEDZZmWdb5a8Dh3wiG_gQw6ZGN9CZKfuuuWO5JEmIB7rgNVFcAKuBx_0bBDBbgdV-yOIb5UZDT2P-_l989TRMFrqnSnaFrdflJh0X6R_xI2zsUVmI_nFOvOSL9FYNhx3w3MvyZn8VjP6xLohnKjqMmfqjUSyRrrw42Kf8n1nzIc5YKeHTlWpQqpdZNo6CxV5NLWLKCQ-v8',
    specs: {
      engine: '4.0L V8',
      gearbox: 'Tiptronic',
      mileage: '8,900 km'
    },
    tags: ['VAT Deductible']
  }
];

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const filteredCars = INITIAL_CARS.filter(car => 
    car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#f2f4f7] dark:bg-[#050608] min-h-screen transition-colors duration-300">
      {/* Centered Main Wrapper */}
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row relative bg-white dark:bg-[#0a0c10] shadow-sm">
        
        {/* Sidebar - Flush with the right part */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen border-l border-slate-100 dark:border-slate-800/50">
          <Header value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

          <div className="max-w-4xl mx-auto p-6 lg:p-12 space-y-32 flex-grow w-full">
            {/* Hero Section */}
            <section className="max-w-2xl py-12">
              <h1 className="text-4xl lg:text-6xl font-display font-light leading-tight mb-8">
                Experience the <span className="font-semibold italic">purity</span> of driving with our curated fleet.
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed dark:text-slate-400">
                We don't just sell cars. We curate an experience that begins from the moment you browse our collection. Every vehicle undergoes a 200-point inspection before it reaches our floor.
              </p>
            </section>

            {/* Car Listing */}
            <div className="space-y-32 pb-12">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-500">No vehicles found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>

          <Footer />
        </main>
      </div>

      {/* Floating Dark Mode Toggle */}
      <button 
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 z-50 p-4 bg-white dark:bg-slate-900 rounded-full shadow-2xl border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Toggle dark mode"
      >
        {isDark ? (
          <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">light_mode</span>
        ) : (
          <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">dark_mode</span>
        )}
      </button>
    </div>
  );
};

export default App;
