import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { VehiclePhoto } from '@nextcar/shared';
import { PhotoDefectEditor } from './PhotoDefectEditor';

interface SortablePhotoItemProps {
    photo: VehiclePhoto & { id: string };
    index: number;
    onRemove: (index: number, url: string) => void;
    disabled?: boolean;
}

export function SortablePhotoItem({ photo, index, onRemove, disabled }: SortablePhotoItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: photo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative rounded-lg overflow-hidden border border-gray-200 bg-white flex flex-col"
        >
            {/* Only the image area is draggable so defect editing doesn't trigger reorder */}
            <div
                className="relative group cursor-grab active:cursor-grabbing"
                {...attributes}
                {...listeners}
            >
                <img
                    src={photo.url}
                    alt={`Vehicle ${index + 1}`}
                    className="w-full h-32 object-cover pointer-events-none"
                />
                <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(index, photo.url);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
                >
                    ×
                </button>
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    #{index + 1}
                </span>
            </div>
            <PhotoDefectEditor photoIndex={index} disabled={disabled} />
        </div>
    );
}
