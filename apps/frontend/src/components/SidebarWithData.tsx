import { getSidebarVehiclePreview } from '../lib/data/vehicles';
import Sidebar from './Sidebar';

const emptyPreview = {
  vehicles: [] as const,
  totalCount: 0,
  lowestPrice: null as number | null,
};

export default async function SidebarWithData() {
  let vehicles = emptyPreview.vehicles;
  let totalCount = emptyPreview.totalCount;
  let lowestPrice = emptyPreview.lowestPrice;

  try {
    const preview = await getSidebarVehiclePreview();
    vehicles = preview.vehicles;
    totalCount = preview.totalCount;
    lowestPrice = preview.lowestPrice;
  } catch {
    // Firestore unavailable (e.g. emulator not running, network error).
    // Render sidebar with empty state so the app still loads.
  }

  return (
    <Sidebar
      vehicles={vehicles}
      totalCount={totalCount}
      lowestPrice={lowestPrice}
    />
  );
}
