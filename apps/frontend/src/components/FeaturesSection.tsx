import { getTranslations } from 'next-intl/server';
import type { Vehicle, VehicleEquipment } from '@nextcar/shared';
import FeatureCategory from './FeatureCategory';

const EQUIPMENT_ORDER: (keyof VehicleEquipment)[] = [
  'airConditioning',
  'infotainment',
  'mirrors',
  'parkingAid',
  'safety',
  'seats',
  'steeringWheel',
  'wheels',
  'windows',
  'other',
];

const CATEGORY_ICONS: Record<keyof VehicleEquipment, string> = {
  airConditioning: 'ac_unit',
  infotainment: 'wifi',
  mirrors: 'rearview_mirror',
  parkingAid: 'local_parking',
  safety: 'shield',
  seats: 'event_seat',
  steeringWheel: 'rotate_right',
  wheels: 'tire_repair',
  windows: 'window',
  other: 'tune',
};

export default async function FeaturesSection({ vehicle }: { vehicle: Vehicle }) {
  const t = await getTranslations('vehicles');
  const groups: Array<{ key: string; icon: string; title: string; items: string[] }> = [];

  if (vehicle.equipment) {
    for (const key of EQUIPMENT_ORDER) {
      const items = vehicle.equipment[key];
      if (items && items.length > 0) {
        const labelKey = `equipmentCategories.${key}` as const;
        groups.push({
          key: `equipment-${key}`,
          icon: CATEGORY_ICONS[key],
          title: t(labelKey),
          items,
        });
      }
    }
  }

  if (vehicle.features && vehicle.features.length > 0) {
    groups.push({
      key: 'additionalFeatures',
      icon: 'star',
      title: t('additionalFeatures'),
      items: vehicle.features,
    });
  }

  if (groups.length === 0) return null;

  return (
    <section aria-labelledby="features-section-heading">
      <h2
        id="features-section-heading"
        className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3"
      >
        <span className="material-symbols-outlined text-primary">build_circle</span>
        {t('equipmentDetails')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {groups.map((group) => (
          <FeatureCategory
            key={group.key}
            icon={group.icon}
            title={group.title}
            items={group.items}
          />
        ))}
      </div>
    </section>
  );
}
