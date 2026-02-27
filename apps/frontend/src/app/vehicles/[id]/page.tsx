import { notFound } from 'next/navigation';
import { getPublishedVehicleById } from '../../../lib/data/vehicles';
import PhotoGallery from '../../../components/PhotoGallery';
import YoutubeEmbed from '../../../components/YoutubeEmbed';
import LeadCaptureForm from '../../../components/LeadCaptureForm';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 60;

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

function SpecRow({ label, value }: { label: string; value?: string | number | null }) {
    if (value === undefined || value === null || value === '') return null;
    return (
        <li className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
            <span className="text-slate-500 text-sm font-medium">{label}</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">{value}</span>
        </li>
    );
}

const formatCategory = (str: string) => str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());

export default async function VehicleDetailPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;
    const intentRaw = resolvedSearchParams?.intent;
    const intent = typeof intentRaw === 'string' ? intentRaw : undefined;

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
                    <div className="w-full lg:w-2/3 space-y-16">
                        <PhotoGallery photos={vehicle.photos || []} />

                        {/* Main Content Sections */}
                        <div className="space-y-16">
                            {/* Key Details & Specs wrapper */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Technical Specs */}
                                <div>
                                    <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                                        <span className="material-symbols-outlined text-primary">engineering</span>
                                        Technical Specs
                                    </h3>
                                    <ul className="space-y-3">
                                        <SpecRow label="Power" value={vehicle.power} />
                                        <SpecRow label="Engine Size" value={vehicle.engineSize} />
                                        <SpecRow label="Doors" value={vehicle.doors} />
                                        <SpecRow label="Seats" value={vehicle.seats} />
                                        <SpecRow label="CO2 Standard" value={vehicle.co2Standard} />
                                        <SpecRow label="Interior Color" value={vehicle.interiorColor} />
                                    </ul>
                                </div>

                                {/* Provenance */}
                                <div>
                                    <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                                        <span className="material-symbols-outlined text-primary">history</span>
                                        History & Provenance
                                    </h3>
                                    <ul className="space-y-3">
                                        <SpecRow label="First Registration" value={vehicle.firstRegistration} />
                                        <SpecRow label="Technical Inspection" value={vehicle.technicalInspection} />
                                        <SpecRow label="Condition" value={vehicle.condition} />
                                        <SpecRow label="Number of Keys" value={vehicle.numberOfKeys} />
                                        <SpecRow label="VIN" value={vehicle.vin} />
                                    </ul>
                                </div>
                            </div>

                            {/* Features List */}
                            {vehicle.features && vehicle.features.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                                        <span className="material-symbols-outlined text-primary">star</span>
                                        Featured Highlights
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {vehicle.features.map((feature, i) => (
                                            <span key={i} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {vehicle.description && (
                                <div>
                                    <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                                        <span className="material-symbols-outlined text-primary">description</span>
                                        Description
                                    </h3>
                                    <div className="prose dark:prose-invert prose-lg text-slate-600 dark:text-slate-400 break-words whitespace-pre-wrap max-w-none">
                                        {vehicle.description}
                                    </div>
                                </div>
                            )}

                            {/* Equipment */}
                            {vehicle.equipment && Object.keys(vehicle.equipment).length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                                        <span className="material-symbols-outlined text-primary">build_circle</span>
                                        Equipment Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {Object.entries(vehicle.equipment).map(([category, items]) => {
                                            if (!items || items.length === 0) return null;
                                            return (
                                                <div key={category}>
                                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">{formatCategory(category)}</h4>
                                                    <ul className="space-y-3">
                                                        {items.map((item, i) => (
                                                            <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-3 leading-tight">
                                                                <span className="material-symbols-outlined text-primary text-base shrink-0">check</span>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Video Embed */}
                            {vehicle.videoLinks && vehicle.videoLinks.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                                        <span className="material-symbols-outlined text-primary">smart_display</span>
                                        Vehicle Video
                                    </h3>
                                    <YoutubeEmbed links={vehicle.videoLinks} />
                                </div>
                            )}

                            {/* Inquiry Form */}
                            <div id="inquiry-form" className="mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-10 shadow-xl scroll-mt-32">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="material-symbols-outlined p-3 bg-primary/10 text-primary rounded-xl text-3xl">mail</span>
                                    <div>
                                        <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-slate-800 dark:text-slate-100">
                                            Interested? Contact Us
                                        </h3>
                                        <p className="text-slate-500">Fast response guaranteed by our sales team.</p>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <LeadCaptureForm vehicleId={id} intent={intent} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/3 space-y-8 sticky top-32">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight uppercase tracking-tighter dark:text-white mb-2">
                                {vehicle.year} {vehicle.make} <br />
                                <span className="text-slate-400">{vehicle.model}</span>
                            </h1>
                            <div className="mt-6">
                                <span className="text-sm font-semibold uppercase tracking-widest text-slate-500 block mb-1">Price</span>
                                <div className="text-5xl font-bold text-primary dark:text-white font-display">
                                    ${vehicle.price.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="material-symbols-outlined text-slate-400 block mb-2">speed</span>
                                <div className="text-sm font-bold uppercase tracking-wider">{vehicle.mileage.toLocaleString()} km</div>
                                <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Mileage</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="material-symbols-outlined text-slate-400 block mb-2">local_gas_station</span>
                                <div className="text-sm font-bold uppercase tracking-wider">{vehicle.fuelType}</div>
                                <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Fuel Type</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="material-symbols-outlined text-slate-400 block mb-2">settings</span>
                                <div className="text-sm font-bold uppercase tracking-wider">{vehicle.transmission}</div>
                                <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Transmission</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="material-symbols-outlined text-slate-400 block mb-2">directions_car</span>
                                <div className="text-sm font-bold uppercase tracking-wider truncate">{vehicle.bodyType}</div>
                                <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Body</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="material-symbols-outlined text-slate-400 block mb-2">palette</span>
                                <div className="text-sm font-bold uppercase tracking-wider truncate">{vehicle.color}</div>
                                <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Color</div>
                            </div>
                            {(vehicle.condition || vehicle.vin) && (
                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-slate-400 block mb-2">sell</span>
                                    <div className="text-sm font-bold uppercase tracking-wider truncate">{vehicle.condition || 'Used'}</div>
                                    <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Condition</div>
                                </div>
                            )}
                        </div>

                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <a href="#inquiry-form" className="block w-full text-center bg-primary dark:bg-white text-white dark:text-primary py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:-translate-y-1 transition-transform active:scale-95 shadow-xl shadow-primary/20 dark:shadow-white/10">
                                I&apos;m Interested
                            </a>
                            <Link href="?intent=test-drive#inquiry-form" scroll={false} className="block w-full text-center bg-transparent border-2 border-slate-200 dark:border-slate-800 dark:text-white py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:border-primary dark:hover:border-white transition-colors active:scale-95">
                                <span className="flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-lg">drive_eta</span>
                                    Test Drive
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Sticky CTA Trigger - moved outside positional parent */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 lg:hidden z-40 transform translate-y-0 transition-transform">
                    <a href="#inquiry-form" className="block w-full text-center bg-primary text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/20">
                        Contact Sales
                    </a>
                </div>
            </main>
        </>
    );
}
