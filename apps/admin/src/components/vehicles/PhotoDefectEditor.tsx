import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { VehicleSchema } from '@nextcar/shared';

interface PhotoDefectEditorProps {
    photoIndex: number;
    disabled?: boolean;
}

export function PhotoDefectEditor({ photoIndex, disabled }: PhotoDefectEditorProps) {
    const { control } = useFormContext<VehicleSchema>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: `photos.${photoIndex}.defects`,
    });

    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-t border-gray-100 bg-gray-50/80">
            <button
                type="button"
                onClick={() => setIsOpen((o) => !o)}
                disabled={disabled}
                className="w-full flex items-center justify-between px-2 py-1.5 text-left text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
                <span>Defects {fields.length > 0 ? `(${fields.length})` : ''}</span>
                <span className="text-gray-400">{isOpen ? '▼' : '▶'}</span>
            </button>
            {isOpen && (
                <div className="px-2 pb-2 space-y-2">
                    {fields.map((field, defectIndex) => (
                        <div key={field.id} className="flex gap-1">
                            <input
                                {...control.register(`photos.${photoIndex}.defects.${defectIndex}.description`)}
                                placeholder="Defect description"
                                disabled={disabled}
                                className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
                            />
                            <button
                                type="button"
                                onClick={() => remove(defectIndex)}
                                disabled={disabled}
                                className="text-red-600 hover:text-red-800 px-1 text-sm font-bold disabled:opacity-50"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => append({ description: '' })}
                        disabled={disabled}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                        + Add defect
                    </button>
                </div>
            )}
        </div>
    );
}
