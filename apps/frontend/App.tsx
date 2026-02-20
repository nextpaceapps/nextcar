import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CarCard from './components/CarCard';
import Footer from './components/Footer';
import { carService } from './src/services/carService';
import type { Car } from '@nextcar/shared';
import './App.css'

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: cars, isLoading } = useQuery({
    queryKey: ['cars', 'published'],
    queryFn: carService.getPublishedCars
  });

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Filter cars by search query across make, model, description
  const filteredCars = (cars || []).filter((car: Car) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const title = `${car.make} ${car.model}`.toLowerCase();
    const desc = (car.description || '').toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  // Map Firestore Car to the display format expected by CarCard
  const displayCars = filteredCars.map((car: Car) => ({
    id: car.id || '',
    title: `${car.make} ${car.model}`,
    description: car.description || `${car.year} ${car.make} ${car.model} — ${car.mileage.toLocaleString()} km, ${car.fuelType}, ${car.transmission}`,
    image: car.images?.find(img => img.isPrimary)?.url || car.images?.[0]?.url || 'https://placehold.co/800x450?text=No+Image',
    specs: {
      engine: car.power || car.engineSize || car.fuelType,
      gearbox: car.transmission,
      mileage: `${car.mileage.toLocaleString()} km`,
    },
    tags: [
      car.bodyType,
      ...(car.features?.slice(0, 2) || []),
    ].filter(Boolean),
  }));

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
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-slate-400 text-lg">Loading inventory...</div>
              </div>
            ) : displayCars.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-slate-400 text-lg">
                  {searchQuery ? 'No cars match your search.' : 'No cars in inventory yet.'}
                </div>
              </div>
            ) : (
              displayCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))
            )}
          </div>

          <Footer />

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
        </main>
      </div>
    </div>
  );
};

export default App;
