import { notFound } from 'next/navigation';
import { getPublishedVehicleById } from '../../../lib/data/vehicles';
import PhotoGallery from '../../../components/PhotoGallery';
import YoutubeEmbed from '../../../components/YoutubeEmbed';
import LeadCaptureForm from '../../../components/LeadCaptureForm';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const vehicle = await getPublishedVehicleById(id);
    if (!vehicle) return { title: 'Not Found' };

    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} — $${vehicle.price.toLocaleString()}`;
    const description = vehicle.description ? vehicle.description.substring(0, 160) : `Check out this premium ${vehicle.year} ${vehicle.make} ${vehicle.model}.`;
    const image = vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos[0].url : '';

    return {
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model} | Nextcar`,
        description,
        openGraph: {
            title,
            description,
            images: image ? [{ url: image }] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: image ? [image] : [],
        }
    };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const vehicle = await getPublishedVehicleById(id);

    if (!vehicle) {
        notFound();
    }

    return (
        <>
            <main className="max-w-5xl mx-auto p-6 lg:p-12 w-full flex-grow">

                <div className="mb-8">
                    <Link href="/vehicles" className="inline-flex items-center text-sm font-semibold text-primary dark:text-white hover:opacity-70 transition-opacity uppercase tracking-wider">
                        <span className="material-symbols-outlined mr-2">arrow_back</span>
                        Back to Inventory
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    <div className="w-full lg:w-2/3">
                        <PhotoGallery photos={vehicle.photos || []} />
                    </div>

                    <div className="w-full lg:w-1/3 space-y-8 sticky top-32">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight uppercase tracking-tighter dark:text-white">
                                {vehicle.year} {vehicle.make} <br />
                                <span className="text-slate-400">{vehicle.model}</span>
                            </h1>
                            <div className="mt-6 text-4xl font-bold text-primary dark:text-white font-display">
                                ${vehicle.price.toLocaleString()}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="material-symbols-outlined text-slate-400 block mb-2">speed</span>
                                <div className="text-sm font-bold uppercase tracking-wider">{vehicle.mileage.toLocaleString()} mi</div>
                                <div className="text-[10px] text-slate-500 font-medium">Mileage</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="material-symbols-outlined text-slate-400 block mb-2">local_gas_station</span>
                                <div className="text-sm font-bold uppercase tracking-wider">{vehicle.fuelType}</div>
                                <div className="text-[10px] text-slate-500 font-medium">Fuel Type</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="material-symbols-outlined text-slate-400 block mb-2">settings</span>
                                <div className="text-sm font-bold uppercase tracking-wider">{vehicle.transmission}</div>
                                <div className="text-[10px] text-slate-500 font-medium">Transmission</div>
                            </div>
                            {vehicle.vin && (
                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-slate-400 block mb-2">tag</span>
                                    <div className="text-sm font-bold uppercase tracking-wider truncate">{vehicle.vin}</div>
                                    <div className="text-[10px] text-slate-500 font-medium">VIN</div>
                                </div>
                            )}
                        </div>

                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <a href="#inquiry-form" className="block w-full text-center bg-primary dark:bg-white text-white dark:text-primary py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:-translate-y-1 transition-transform active:scale-95 shadow-xl shadow-primary/20 dark:shadow-white/10">
                                Contact Sales
                            </a>
                            <a href="#inquiry-form" className="block w-full text-center bg-transparent border-2 border-slate-200 dark:border-slate-800 dark:text-white py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:border-primary dark:hover:border-white transition-colors active:scale-95">
                                Test Drive
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-20 max-w-3xl">
                    <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6">
                        Description
                    </h3>
                    <div className="prose dark:prose-invert prose-lg text-slate-600 dark:text-slate-400 break-words whitespace-pre-wrap">
                        {vehicle.description || 'No description provided.'}
                    </div>
                </div>

                <YoutubeEmbed links={vehicle.videoLinks} />

                <div className="mt-12 max-w-3xl mx-auto lg:mx-0">
                    <LeadCaptureForm vehicleId={id} />
                </div>

            </main>
        </>
    );
}
