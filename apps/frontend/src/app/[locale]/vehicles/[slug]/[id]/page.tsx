import {
  generateVehicleDetailMetadata,
  renderVehicleDetailPage,
  revalidate,
} from '../../vehicleDetailPage';

type Props = {
  params: Promise<{ locale: string; slug: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export { revalidate };

export async function generateMetadata({ params }: { params: Props['params'] }) {
  const { locale, id } = await params;
  return generateVehicleDetailMetadata({ locale, id });
}

export default async function VehicleDetailSeoPage({ params, searchParams }: Props) {
  const { locale, slug, id } = await params;
  return renderVehicleDetailPage({
    locale,
    slug,
    id,
    searchParams: await searchParams,
  });
}

