import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { carSchema, YOUTUBE_URL_REGEX, type CarSchema, type Car, type CarPhoto } from '@nextcar/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { carService } from '../../services/carService';
import { aiService } from '../../services/aiService';
import { storageService } from '../../services/storageService';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortablePhotoItem } from './SortablePhotoItem';

interface CarFormProps {
    initialData?: Car;
    isEdit?: boolean;
}

interface PendingImage {
    file: File;
    preview: string;
    progress: number;
}

export default function CarForm({ initialData, isEdit = false }: CarFormProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // AI parsing state
    const [rawText, setRawText] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);
    const [parseSuccess, setParseSuccess] = useState(false);

    // Image upload state
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Cleanup object URLs on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            pendingImages.forEach(img => URL.revokeObjectURL(img.preview));
        };
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    // Video links state
    const [videoLinks, setVideoLinks] = useState<string[]>(initialData?.videoLinks || []);
    const [newVideoLink, setNewVideoLink] = useState('');
    const [videoLinkError, setVideoLinkError] = useState<string | null>(null);

    const { register, control, handleSubmit, reset, getValues, formState: { errors, isSubmitting } } = useForm<CarSchema>({
        resolver: zodResolver(carSchema),
        defaultValues: initialData ? {
            ...initialData,
            features: initialData.features || [],
            photos: initialData.photos || []
        } : {
            status: 'draft' as const,
            features: [],
            photos: [],
            year: new Date().getFullYear(),
            price: 0,
            mileage: 0,
            make: '',
            model: '',
            fuelType: 'Petrol' as const,
            transmission: 'Automatic' as const,
            bodyType: 'Sedan' as const,
            color: '',
        }
    });

    // Helper for optional number fields — converts empty string to undefined instead of NaN
    const optionalNumber = (name: keyof CarSchema) => register(name, {
        setValueAs: (v: string | undefined | null) => (v === '' || v === undefined || v === null) ? undefined : Number(v)
    });

    const { fields: photoFields, remove: removePhoto, move: movePhoto } = useFieldArray({
        control,
        name: "photos"
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = photoFields.findIndex((item) => item.id === active.id);
            const newIndex = photoFields.findIndex((item) => item.id === over.id);
            movePhoto(oldIndex, newIndex);
        }
    };

    const handleRemoveExistingPhoto = async (index: number, photoUrl: string) => {
        if (!window.confirm("Are you sure you want to delete this photo forever?")) return;

        try {
            await storageService.deleteCarImage(photoUrl);
            removePhoto(index);

            if (isEdit && initialData?.id) {
                const photos = getValues('photos') || [];
                const updatedPhotos = photos.map((p, i) => ({ ...p, order: i }));
                await carService.updateCar(initialData.id, { photos: updatedPhotos });
                queryClient.invalidateQueries({ queryKey: ['cars'] });
            }
        } catch (error) {
            console.error('Failed to delete photo:', error);
            setSaveError('Failed to delete photo.');
        }
    };

    // --- AI Parsing ---
    const handleParse = async () => {
        if (!rawText.trim()) return;

        setIsParsing(true);
        setParseError(null);
        setParseSuccess(false);

        try {
            const parsed = await aiService.parseCarListing(rawText);
            // Reset form with parsed data
            reset({
                ...parsed,
                photos: initialData?.photos || [],
            });
            setParseSuccess(true);
            setRawText('');
        } catch (err: any) {
            setParseError(err.message || 'Failed to parse listing data');
        } finally {
            setIsParsing(false);
        }
    };

    // --- Image Handling ---
    const handleFilesSelected = (files: FileList | null) => {
        if (!files) return;

        const newImages: PendingImage[] = Array.from(files).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
        }));

        setPendingImages(prev => [...prev, ...newImages]);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        handleFilesSelected(e.dataTransfer.files);
    }, [pendingImages.length, photoFields.length]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const removePendingImage = (index: number) => {
        setPendingImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const addVideoLink = () => {
        const url = newVideoLink.trim();
        setVideoLinkError(null);
        if (url) {
            if (!YOUTUBE_URL_REGEX.test(url)) {
                setVideoLinkError('Must be a valid YouTube URL (e.g. youtube.com/watch?v=)');
                return;
            }
            if (videoLinks.includes(url)) {
                setVideoLinkError('This video link is already added');
                return;
            }
            setVideoLinks(prev => [...prev, url]);
            setNewVideoLink('');
        }
    };

    const removeVideoLink = (index: number) => {
        setVideoLinks(prev => prev.filter((_, i) => i !== index));
    };

    // --- Form Submit ---
    const createMutation = useMutation({
        mutationFn: carService.createCar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            navigate('/cars');
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: CarSchema) => {
            const id = initialData?.id;
            if (!id) throw new Error('Cannot update car without an ID');
            return carService.updateCar(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cars'] });
            navigate('/cars');
        }
    });

    const onSubmit: SubmitHandler<CarSchema> = async (data) => {
        try {
            setIsUploading(pendingImages.length > 0);

            // Generate a temporary ID for new cars to use as storage path
            const carId = isEdit && initialData?.id ? initialData.id : `temp_${Date.now()}`;

            // Upload pending images
            let allPhotos = [...(data.photos || [])];
            if (pendingImages.length > 0) {
                const urls = await storageService.uploadMultipleImages(
                    carId,
                    pendingImages.map(img => img.file),
                    (fileIndex, progress) => {
                        setPendingImages(prev => prev.map((img, i) =>
                            i === fileIndex ? { ...img, progress } : img
                        ));
                    }
                );

                const startOrder = allPhotos.length;
                const newPhotos = urls.map((url, i) => ({
                    url,
                    order: startOrder + i,
                }));

                allPhotos = [...allPhotos, ...newPhotos];
            }

            allPhotos = allPhotos.map((p, i) => ({ ...p, order: i }));

            const finalData = { ...data, photos: allPhotos, videoLinks };

            if (isEdit) {
                await updateMutation.mutateAsync(finalData);
            } else {
                await createMutation.mutateAsync(finalData);
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            console.error('Error saving car:', error);
            setSaveError(message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* AI Parsing Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <span className="text-2xl">✨</span> AI-Powered Data Entry
                </h3>
                <p className="text-sm text-indigo-700 mb-4">
                    Paste raw listing data below and let AI parse it into structured fields automatically.
                </p>
                <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    rows={8}
                    className="w-full rounded-md border-indigo-300 shadow-sm border p-3 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Paste car listing data here...\n\nExample:\nFirst registration: 17/04/2018\nModel year: 2016\nMileage: 115,946 km\nFuel type: Petrol/Electric (HEV)\n...`}
                />
                <div className="flex items-center gap-4 mt-3">
                    <button
                        type="button"
                        onClick={handleParse}
                        disabled={isParsing || !rawText.trim()}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2"
                    >
                        {isParsing ? (
                            <>
                                <span className="animate-spin">⏳</span> Parsing...
                            </>
                        ) : (
                            <>
                                <span>🤖</span> Parse with AI
                            </>
                        )}
                    </button>
                    {parseSuccess && (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            ✅ Fields populated! Review and save below.
                        </span>
                    )}
                    {parseError && (
                        <span className="text-red-600 text-sm font-medium">
                            ❌ {parseError}
                        </span>
                    )}
                </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Car' : 'Add New Car'}</h2>

                {saveError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                        <span className="text-sm">❌ {saveError}</span>
                        <button type="button" onClick={() => setSaveError(null)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                    </div>
                )}

                {/* Basic Info */}
                <fieldset className="border border-gray-200 rounded-lg p-4">
                    <legend className="text-sm font-semibold text-gray-600 px-2">Basic Information</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Make *</label>
                            <input {...register('make')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                            {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Model *</label>
                            <input {...register('model')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                            {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Year *</label>
                            <input type="number" {...register('year', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price *</label>
                            <input type="number" {...register('price', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mileage (km) *</label>
                            <input type="number" {...register('mileage', { valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                            {errors.mileage && <p className="text-red-500 text-xs mt-1">{errors.mileage.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Color *</label>
                            <input {...register('color')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                            {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color.message}</p>}
                        </div>
                    </div>
                </fieldset>

                {/* Technical Specs */}
                <fieldset className="border border-gray-200 rounded-lg p-4">
                    <legend className="text-sm font-semibold text-gray-600 px-2">Technical Specifications</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fuel Type *</label>
                            <select {...register('fuelType')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Transmission *</label>
                            <select {...register('transmission')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Body Type *</label>
                            <select {...register('bodyType')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="Coupe">Coupe</option>
                                <option value="Convertible">Convertible</option>
                                <option value="Wagon">Wagon</option>
                                <option value="Van">Van</option>
                                <option value="Truck">Truck</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Power</label>
                            <input {...register('power')} placeholder="e.g. 72 kW (98 Hp)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Engine Size</label>
                            <input {...register('engineSize')} placeholder="e.g. 1,797 cc" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CO2 Standard</label>
                            <input {...register('co2Standard')} placeholder="e.g. EU6b" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Doors</label>
                            <input type="number" {...optionalNumber('doors')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Seats</label>
                            <input type="number" {...optionalNumber('seats')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">VIN</label>
                            <input {...register('vin')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                    </div>
                </fieldset>

                {/* Additional Details */}
                <fieldset className="border border-gray-200 rounded-lg p-4">
                    <legend className="text-sm font-semibold text-gray-600 px-2">Additional Details</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Interior Color</label>
                            <input {...register('interiorColor')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Number of Keys</label>
                            <input type="number" {...optionalNumber('numberOfKeys')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Condition</label>
                            <input {...register('condition')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Registration</label>
                            <input {...register('firstRegistration')} placeholder="DD/MM/YYYY" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Technical Inspection</label>
                            <input {...register('technicalInspection')} placeholder="DD/MM/YYYY" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select {...register('status')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="sold">Sold</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea {...register('description')} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                    </div>
                </fieldset>

                {/* Photo Upload Section */}
                <fieldset className="border border-gray-200 rounded-lg p-4">
                    <legend className="text-sm font-semibold text-gray-600 px-2">Photos</legend>

                    {/* Existing photos (for edit mode) */}
                    {photoFields.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Existing photos:</p>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={photoFields.map(f => f.id)} strategy={rectSortingStrategy}>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {photoFields.map((field, index) => {
                                            const photo = field as unknown as CarPhoto & { id: string };
                                            return (
                                                <SortablePhotoItem
                                                    key={field.id}
                                                    photo={photo}
                                                    index={index}
                                                    onRemove={handleRemoveExistingPhoto}
                                                />
                                            );
                                        })}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>
                    )}

                    {/* Pending uploads preview */}
                    {pendingImages.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">New photos to upload:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {pendingImages.map((img, index) => (
                                    <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={img.preview}
                                            alt={`Upload ${index + 1}`}
                                            className="w-full h-32 object-cover"
                                        />
                                        {img.progress > 0 && img.progress < 100 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-white font-bold">{img.progress}%</span>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removePendingImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                            #{photoFields.length + index + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Drop zone */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                    >
                        <div className="text-4xl mb-2">📸</div>
                        <p className="text-sm text-gray-600 font-medium">
                            Drag & drop photos here or click to browse
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Supports JPG, PNG, WebP
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFilesSelected(e.target.files)}
                            className="hidden"
                        />
                    </div>
                </fieldset>

                {/* Video Links Section */}
                <fieldset className="border border-gray-200 rounded-lg p-4">
                    <legend className="text-sm font-semibold text-gray-600 px-2">Video Links</legend>
                    {videoLinks.length > 0 && (
                        <div className="mb-3 space-y-2">
                            {videoLinks.map((link, index) => (
                                <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-md px-3 py-2">
                                    <span className="text-sm text-gray-700 truncate flex-1">🎬 {link}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeVideoLink(index)}
                                        className="text-red-500 hover:text-red-700 text-sm font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <input
                            value={newVideoLink}
                            onChange={(e) => {
                                setNewVideoLink(e.target.value);
                                if (videoLinkError) setVideoLinkError(null);
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addVideoLink())}
                            placeholder="https://youtube.com/watch?v=..."
                            className={`flex-1 rounded-md shadow-sm border p-2 text-sm ${videoLinkError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                        />
                        <button
                            type="button"
                            onClick={addVideoLink}
                            disabled={!newVideoLink.trim()}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 text-sm font-medium"
                        >
                            + Add
                        </button>
                    </div>
                    {videoLinkError && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-red-600 font-medium bg-red-50 px-3 py-2 rounded-md border border-red-100">
                            <span>❌</span> {videoLinkError}
                        </p>
                    )}
                </fieldset>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/cars')}
                        className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>Uploading photos...</>
                        ) : isSubmitting ? (
                            <>Saving...</>
                        ) : (
                            <>💾 Save Car</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
