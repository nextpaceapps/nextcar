import type { Vehicle } from '@nextcar/shared';
import { getSidebarVehiclePreview } from '../lib/data/vehicles';
import Sidebar from './Sidebar';

export default async function SidebarWithData() {
  let vehicles: Vehicle[] = [];
  let totalCount = 0;
  let lowestPrice: number | null = null;

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
