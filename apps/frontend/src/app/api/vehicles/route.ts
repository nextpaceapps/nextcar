import { NextResponse } from 'next/server';
import { getPublishedVehicles } from '../../../lib/data/vehicles';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit')) || 20;

    try {
        const vehicles = await getPublishedVehicles(limit);
        return NextResponse.json({ success: true, data: vehicles });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
    }
}
