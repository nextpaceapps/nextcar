import { notFound, permanentRedirect } from 'next/navigation';
import { getPublishedVehicleById } from '@/lib/data/vehicles';
import { createLocalizedVehiclePath } from '@/lib/vehicleSlug';

export const revalidate = 60;

function buildQueryString(searchParams: { [key: string]: string | string[] | undefined }): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      query.append(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    }
  }

  const serialized = query.toString();
  return serialized ? `?${serialized}` : '';
}

export default async function VehicleDetailLegacyRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale, id } = await params;
  const vehicle = await getPublishedVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  permanentRedirect(
    `${createLocalizedVehiclePath(vehicle, locale)}${buildQueryString(await searchParams)}`
  );
}
