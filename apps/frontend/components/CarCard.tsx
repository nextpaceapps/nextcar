
import React from 'react';
import { Car } from '../types';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <article className="group cursor-default">
      <div className="overflow-hidden rounded-large bg-slate-100 dark:bg-slate-900 mb-8 transition-all duration-700 relative aspect-[16/9]">
        <img 
          alt={car.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          src={car.image} 
        />
        {/* Decorative elements can go here */}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-3xl font-display font-semibold mb-3 dark:text-white group-hover:text-primary dark:group-hover:text-slate-300 transition-colors">
            {car.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {car.description}
          </p>
          <div className="flex flex-wrap gap-3">
            {car.tags.map(tag => (
              <span key={tag} className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full text-[10px] font-bold uppercase tracking-tight dark:text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 border-l border-slate-100 dark:border-slate-800 pl-8 h-full items-center">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Engine</p>
            <p className="font-semibold text-sm dark:text-white">{car.specs.engine}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Gearbox</p>
            <p className="font-semibold text-sm dark:text-white">{car.specs.gearbox}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Mileage</p>
            <p className="font-semibold text-sm dark:text-white">{car.specs.mileage}</p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CarCard;
