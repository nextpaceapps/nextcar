import React from 'react';
import { Settings2, Info, RotateCcw, ShieldAlert } from 'lucide-react';

interface PromptSettingsProps {
  systemInstruction: string;
  isolationPrompt: string;
  compositionPrompt: string;
  backgroundImage: string | null;
  setSystemInstruction: (v: string) => void;
  setIsolationPrompt: (v: string) => void;
  setCompositionPrompt: (v: string) => void;
  setBackgroundImage: (url: string | null, mimeType: string | null) => void;
  onReset: () => void;
}

export const PromptSettings: React.FC<PromptSettingsProps> = ({
  systemInstruction,
  isolationPrompt,
  compositionPrompt,
  backgroundImage,
  setSystemInstruction,
  setIsolationPrompt,
  setCompositionPrompt,
  setBackgroundImage,
  onReset,
}) => {
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBackgroundImage(ev.target?.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const promptFieldClassName =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] leading-7 text-black shadow-sm outline-none transition-all placeholder:text-slate-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 resize-y';

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-slate-900">Pipeline Settings</h2>
          </div>
          <p className="text-sm leading-6 text-slate-500">
            Tune the system and stage prompts with a clearer editing layout.
          </p>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          title="Reset to defaults"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600">
            <ShieldAlert className="w-4 h-4" />
            Global System Instruction
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sets the editor persona and rules used across every generation step.
          </p>
          <textarea
            value={systemInstruction}
            onChange={(e) => setSystemInstruction(e.target.value)}
            className={`${promptFieldClassName} mt-4 min-h-[180px]`}
            style={{ backgroundColor: '#fff', color: '#000' }}
            placeholder="General AI instructions..."
          />
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5" />
            Defines AI persona and general rules for both stages.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Static Studio Background
              </label>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upload the room or studio image used for every final composition.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {backgroundImage ? (
              <div className="relative mt-4 group aspect-video overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <img src={backgroundImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button
                  onClick={() => setBackgroundImage(null, null)}
                  className="absolute right-2 top-2 rounded-md bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="mt-4 flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white transition-all hover:border-blue-400 hover:bg-blue-50/40">
                <RotateCcw className="mb-2 h-6 w-6 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">Upload room photo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleBgUpload} />
              </label>
            )}
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <Info className="w-3.5 h-3.5" />
              This image will be used as background for all cars.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Stage 1: Isolation
              </label>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Describe how the source image should be cleaned and the vehicle extracted.
              </p>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 shadow-sm">
              Input cleanup
            </span>
          </div>
          <textarea
            value={isolationPrompt}
            onChange={(e) => setIsolationPrompt(e.target.value)}
            className={`${promptFieldClassName} mt-4 min-h-[170px]`}
            style={{ backgroundColor: '#fff', color: '#000' }}
            placeholder="Instructions for background removal..."
          />
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5" />
            Used to extract the car from original photo.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Stage 2: Composition
              </label>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Explain how the isolated vehicle should be placed into the final studio scene.
              </p>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 shadow-sm">
              Final render
            </span>
          </div>
          <textarea
            value={compositionPrompt}
            onChange={(e) => setCompositionPrompt(e.target.value)}
            className={`${promptFieldClassName} mt-4 min-h-[210px]`}
            style={{ backgroundColor: '#fff', color: '#000' }}
            placeholder="Instructions for static background..."
          />
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5" />
            Used to place the isolated car into the studio.
          </p>
        </div>
      </div>
    </div>
  );
};
