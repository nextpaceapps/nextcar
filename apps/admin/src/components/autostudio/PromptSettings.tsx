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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Pipeline Settings</h2>
        </div>
        <button 
          onClick={onReset}
          className="p-2 hover:bg-slate-800 text-slate-500 hover:text-slate-300 rounded-lg transition-all flex items-center gap-1 text-xs"
          title="Reset to defaults"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-500 mb-3">
            <ShieldAlert className="w-4 h-4" />
            Global System Instruction
          </label>
          <textarea
            value={systemInstruction}
            onChange={(e) => setSystemInstruction(e.target.value)}
            className="w-full h-32 bg-slate-900/80 border border-slate-700 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-sans leading-relaxed"
            placeholder="General AI instructions..."
          />
          <p className="mt-2 text-[10px] text-slate-500 flex items-center gap-1.5 px-1">
            <Info className="w-3.5 h-3.5" />
            Defines AI persona and general rules for both stages.
          </p>
        </div>

        <div className="h-px bg-slate-700/50 my-4" />

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 mb-3 px-1">
            Static Studio Background
          </label>
          <div className="space-y-3">
            {backgroundImage ? (
              <div className="relative group aspect-video rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                <img src={backgroundImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => setBackgroundImage(null, null)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-900/50 cursor-pointer transition-all">
                <RotateCcw className="w-6 h-6 text-slate-500 mb-2" />
                <span className="text-xs text-slate-400">Upload room photo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleBgUpload} />
              </label>
            )}
            <p className="text-[10px] text-slate-500 flex items-center gap-1.5 px-1">
              <Info className="w-3.5 h-3.5" />
              This image will be used as background for all cars.
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-700/50 my-4" />

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 mb-3 px-1">
            Stage 1: Isolation
          </label>
          <textarea
            value={isolationPrompt}
            onChange={(e) => setIsolationPrompt(e.target.value)}
            className="w-full h-32 bg-slate-900/80 border border-slate-700 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans leading-relaxed"
            placeholder="Instructions for background removal..."
          />
          <p className="mt-2 text-[10px] text-slate-500 flex items-center gap-1.5 px-1">
            <Info className="w-3.5 h-3.5" />
            Used to extract the car from original photo.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 mb-3 px-1">
            Stage 2: Composition
          </label>
          <textarea
            value={compositionPrompt}
            onChange={(e) => setCompositionPrompt(e.target.value)}
            className="w-full h-40 bg-slate-900/80 border border-slate-700 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-sans leading-relaxed"
            placeholder="Instructions for static background..."
          />
          <p className="mt-2 text-[10px] text-slate-500 flex items-center gap-1.5 px-1">
            <Info className="w-3.5 h-3.5" />
            Used to place the isolated car into the studio.
          </p>
        </div>
      </div>
    </div>
  );
};
