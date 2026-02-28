import { getTranslations } from 'next-intl/server';
import type { Vehicle } from '@nextcar/shared';
import SpecCard from './SpecCard';

function formatEngineSize(engineSize: string): string {
  const trimmed = engineSize.trim();
  return trimmed.endsWith('L') ? trimmed : `${trimmed}L`;
}

function formatPower(power: string): string {
  const trimmed = power.trim();
  return trimmed.endsWith('kW') ? trimmed : `${trimmed} kW`;
}

export default async function TechnicalSpecs({ vehicle }: { vehicle: Vehicle }) {
  const t = await getTranslations('vehicles');

  const specs: Array<{ icon: string; label: string; value: string }> = [];

  if (vehicle.engineSize != null && String(vehicle.engineSize).trim() !== '') {
    specs.push({
      icon: 'engineering',
      label: t('engine'),
      value: formatEngineSize(String(vehicle.engineSize)),
    });
  }

  if (vehicle.power != null && String(vehicle.power).trim() !== '') {
    specs.push({
      icon: 'bolt',
      label: t('power'),
      value: formatPower(String(vehicle.power)),
    });
  }

  if (vehicle.transmission != null && String(vehicle.transmission).trim() !== '') {
    specs.push({
      icon: 'settings',
      label: t('transmission'),
      value: vehicle.transmission,
    });
  }

  if (vehicle.mileage != null && typeof vehicle.mileage === 'number') {
    specs.push({
      icon: 'speed',
      label: t('mileage'),
      value: `${vehicle.mileage.toLocaleString()} ${t('km')}`,
    });
  }

  if (vehicle.year != null) {
    specs.push({
      icon: 'calendar_today',
      label: t('year'),
      value: String(vehicle.year),
    });
  }

  if (vehicle.fuelType != null && String(vehicle.fuelType).trim() !== '') {
    specs.push({
      icon: 'local_gas_station',
      label: t('fuelType'),
      value: vehicle.fuelType,
    });
  }

  if (vehicle.color != null && String(vehicle.color).trim() !== '') {
    specs.push({
      icon: 'palette',
      label: t('color'),
      value: vehicle.color,
    });
  }

  if (vehicle.doors != null && vehicle.doors > 0) {
    specs.push({
      icon: 'door_front',
      label: t('doors'),
      value: String(vehicle.doors),
    });
  }

  if (specs.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="technical-specs-heading">
      <h2
        id="technical-specs-heading"
        className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3"
      >
        <span className="material-symbols-outlined text-primary">engineering</span>
        {t('technicalSpecs')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {specs.map((spec) => (
          <SpecCard
            key={spec.icon}
            icon={spec.icon}
            label={spec.label}
            value={spec.value}
          />
        ))}
      </div>
    </section>
  );
}
