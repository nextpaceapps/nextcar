import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Check, FolderOpen, ImagePlus, X } from 'lucide-react';
import { db } from '../../services/autostudioDb';

export interface AutoStudioGalleryImportItem {
  historyId: string;
  dataUrl: string;
  suggestedName: string;
}

interface GalleryItemWithHistory {
  galleryItemId: string;
  historyId: string;
  dataUrl: string;
}

interface AutoStudioGalleryPickerProps {
  disabled?: boolean;
  onClose: () => void;
  onImport: (items: AutoStudioGalleryImportItem[]) => void | Promise<void>;
}

function getExtensionFromDataUrl(dataUrl: string): string {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
  const mimeType = match?.[1];

  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    case 'image/png':
    default:
      return 'png';
  }
}

export function AutoStudioGalleryPicker({
  disabled = false,
  onClose,
  onImport,
}: AutoStudioGalleryPickerProps) {
  const liveGalleries = useLiveQuery(
    () => db.galleries.orderBy('createdAt').reverse().toArray(),
    []
  );
  const galleries = useMemo(() => liveGalleries ?? [], [liveGalleries]);

  const galleryItemCounts = useLiveQuery(
    async () => {
      const items = await db.galleryItems.toArray();
      const counts: Record<string, number> = {};

      for (const item of items) {
        counts[item.galleryId] = (counts[item.galleryId] ?? 0) + 1;
      }

      return counts;
    },
    []
  ) ?? {};

  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);

  const effectiveSelectedGalleryId = useMemo(() => {
    if (galleries.length === 0) return null;
    return galleries.some((gallery) => gallery.id === selectedGalleryId)
      ? selectedGalleryId
      : galleries[0].id;
  }, [galleries, selectedGalleryId]);

  const liveSelectedGalleryItems = useLiveQuery(
    async (): Promise<GalleryItemWithHistory[]> => {
      if (!effectiveSelectedGalleryId) return [];

      const items = await db.galleryItems.where('galleryId').equals(effectiveSelectedGalleryId).sortBy('addedAt');
      const withHistory = await Promise.all(
        items.map(async (item) => ({
          galleryItemId: item.id,
          historyId: item.historyId,
          history: await db.history.get(item.historyId),
        }))
      );

      return withHistory
        .filter((item): item is typeof item & { history: NonNullable<typeof item.history> } => item.history != null)
        .map((item) => ({
          galleryItemId: item.galleryItemId,
          historyId: item.historyId,
          dataUrl: item.history.final,
        }));
    },
    [effectiveSelectedGalleryId]
  );
  const selectedGalleryItems = useMemo(
    () => liveSelectedGalleryItems ?? [],
    [liveSelectedGalleryItems]
  );

  const visibleSelectedHistoryIds = useMemo(() => {
    const currentHistoryIds = new Set(selectedGalleryItems.map((item) => item.historyId));
    return selectedHistoryIds.filter((historyId) => currentHistoryIds.has(historyId));
  }, [selectedGalleryItems, selectedHistoryIds]);

  const selectedHistoryIdSet = useMemo(() => new Set(visibleSelectedHistoryIds), [visibleSelectedHistoryIds]);

  const toggleHistoryId = (historyId: string) => {
    setSelectedHistoryIds((previous) =>
      previous.includes(historyId)
        ? previous.filter((id) => id !== historyId)
        : [...previous, historyId]
    );
  };

  const handleImport = async () => {
    const itemsToImport = selectedGalleryItems
      .filter((item) => selectedHistoryIdSet.has(item.historyId))
      .map((item, index) => ({
        historyId: item.historyId,
        dataUrl: item.dataUrl,
        suggestedName: `autostudio-${item.historyId}-${index + 1}.${getExtensionFromDataUrl(item.dataUrl)}`,
      }));

    await onImport(itemsToImport);
  };

  return (
    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <FolderOpen className="h-4 w-4 text-blue-600" />
            Import From AutoStudio Gallery
          </h4>
          <p className="mt-1 text-xs text-gray-500">
            Choose a gallery, then select one or more processed images to add to this vehicle.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-gray-400 transition-colors hover:bg-white hover:text-gray-600"
          aria-label="Close AutoStudio gallery picker"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {galleries.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center">
          <p className="text-sm font-medium text-gray-600">No AutoStudio galleries yet.</p>
          <p className="mt-1 text-xs text-gray-500">
            Create a gallery in AutoStudio and add processed images there first.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {galleries.map((gallery) => {
              const isSelected = gallery.id === effectiveSelectedGalleryId;

              return (
                <button
                  key={gallery.id}
                  type="button"
                  onClick={() => {
                    setSelectedGalleryId(gallery.id);
                    setSelectedHistoryIds([]);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-700'
                  }`}
                >
                  {gallery.name} ({galleryItemCounts[gallery.id] ?? 0})
                </button>
              );
            })}
          </div>

          {selectedGalleryItems.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center">
              <p className="text-sm font-medium text-gray-600">This gallery is empty.</p>
              <p className="mt-1 text-xs text-gray-500">Add images from AutoStudio Recent Processing first.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {selectedGalleryItems.map((item, index) => {
                  const isSelected = selectedHistoryIdSet.has(item.historyId);

                  return (
                    <button
                      key={item.galleryItemId}
                      type="button"
                      onClick={() => toggleHistoryId(item.historyId)}
                      className={`group relative overflow-hidden rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <img
                        src={item.dataUrl}
                        alt={`Gallery image ${index + 1}`}
                        className="h-32 w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-gray-400 shadow-sm">
                        {isSelected ? <Check className="h-4 w-4 text-blue-600" /> : null}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <span className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Image {index + 1}
                        </span>
                        {isSelected ? (
                          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Selected
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white px-3 py-3">
                <p className="text-sm text-gray-600">
                  {visibleSelectedHistoryIds.length} image{visibleSelectedHistoryIds.length !== 1 ? 's' : ''} selected
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void handleImport();
                    }}
                    disabled={disabled || visibleSelectedHistoryIds.length === 0}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Add Selected Images
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
