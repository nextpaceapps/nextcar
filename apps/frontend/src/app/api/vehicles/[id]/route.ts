import { NextResponse } from 'next/server';
import { getPublishedVehicleById } from '../../../../lib/data/vehicles';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const vehicle = await getPublishedVehicleById(id);
        if (!vehicle) {
            return NextResponse.json({ success: false, error: { message: 'Vehicle not found' } }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: vehicle });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
    }
}
