import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  History, 
  Loader2, 
  CheckCircle2, 
  Download,
  Trash2,
  Image as ImageIcon,
  Info,
  RotateCcw,
  FolderPlus,
  FolderOpen,
  Plus
} from 'lucide-react';
import { ImageUploader } from '../components/autostudio/ImageUploader';
import { PromptSettings } from '../components/autostudio/PromptSettings';
import { processCarImage } from '../services/autostudioService';
import { db } from '../services/autostudioDb';
import { useLiveQuery } from 'dexie-react-hooks';

interface QueueItem {
  id: string;
  base64: string;
  mimeType: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  stage?: 'isolation' | 'composition';
  error?: string;
  result?: string;
}

export default function AutoStudioPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundImageMimeType, setBackgroundImageMimeType] = useState<string | null>(null);

  const history = useLiveQuery(
    () => db.history.orderBy('timestamp').reverse().limit(20).toArray(),
    []
  ) || [];

  const galleries = useLiveQuery(
    () => db.galleries.orderBy('createdAt').reverse().toArray(),
    []
  ) || [];

  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
  const [newGalleryName, setNewGalleryName] = useState('');
  const [addToGalleryHistoryId, setAddToGalleryHistoryId] = useState<string | null>(null);

  const galleryItemCounts = useLiveQuery(
    async () => {
      const items = await db.galleryItems.toArray();
      const counts: Record<string, number> = {};
      for (const i of items) {
        counts[i.galleryId] = (counts[i.galleryId] ?? 0) + 1;
      }
      return counts;
    },
    []
  ) ?? {};

  const selectedGalleryItems = useLiveQuery(
    async () => {
      if (!selectedGalleryId) return [];
      const items = await db.galleryItems.where('galleryId').equals(selectedGalleryId).sortBy('addedAt');
      const withHistory = await Promise.all(
        items.map(async (gi) => ({ galleryItem: gi, history: await db.history.get(gi.historyId) }))
      );
      return withHistory.filter((x): x is { galleryItem: typeof items[0]; history: NonNullable<typeof x.history> } => x.history != null);
    },
    [selectedGalleryId]
  ) ?? [];
  
  const [systemInstruction, setSystemInstruction] = useState(
    "You are a professional automotive photo editor. Your goal is to process car photos with high precision, maintaining the vehicle's shape, color, and details while ensuring a clean and realistic output."
  );
  const [isolationPrompt, setIsolationPrompt] = useState(
    "Extract the car from this image. Remove all background elements, shadows, and surroundings. Return only the car isolated on a clean white background."
  );
  const [compositionPrompt, setCompositionPrompt] = useState(
    "Place the isolated car onto a specific, static studio background. This background must be a consistent professional room with neutral grey tones and soft studio lighting. It should look exactly the same for every vehicle, as if all cars were photographed in the same physical room."
  );

  const loadSettings = async () => {
    const settings = await db.settings.get('current');
    if (settings) {
      setBackgroundImage(settings.backgroundImage);
      setBackgroundImageMimeType(settings.backgroundImageMimeType);
    }
  };

  const resetPrompts = () => {
    setSystemInstruction("You are a professional automotive photo editor. Your goal is to process car photos with high precision, maintaining the vehicle's shape, color, and details while ensuring a clean and realistic output.");
    setIsolationPrompt("Extract the car from this image. Remove all background elements, shadows, and surroundings. Return only the car isolated on a clean white background.");
    setCompositionPrompt("Place the isolated car onto a specific, static studio background. This background must be a consistent professional room with neutral grey tones and soft studio lighting. It should look exactly the same for every vehicle, as if all cars were photographed in the same physical room.");
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSetBackgroundImage = async (url: string | null, mimeType: string | null) => {
    setBackgroundImage(url);
    setBackgroundImageMimeType(mimeType);
    await db.settings.put({
      id: 'current',
      backgroundImage: url,
      backgroundImageMimeType: mimeType
    });
  };

  const handleImagesSelect = (images: { base64: string; mimeType: string; name: string }[]) => {
    const newItems: QueueItem[] = images.map(img => ({
      id: Math.random().toString(36).substr(2, 9),
      base64: img.base64,
      mimeType: img.mimeType,
      name: img.name,
      status: 'pending'
    }));
    setQueue(prev => [...prev, ...newItems]);
  };

  useEffect(() => {
    const processItem = async (itemId: string) => {
      const item = queue.find(i => i.id === itemId);
      if (!item) return;

      setQueue(prev => prev.map(i => i.id === itemId ? { ...i, status: 'processing', stage: 'isolation' } : i));

      setIsProcessingBatch(true);

      try {
        const finalUrl = await processCarImage(
          item.base64,
          item.mimeType,
          systemInstruction,
          isolationPrompt,
          compositionPrompt,
          backgroundImage,
          backgroundImageMimeType,
          (stage) => {
            setQueue(prev => prev.map(i => i.id === itemId ? { ...i, stage } : i));
          }
        );

        try {
          await db.history.add({
            id: Math.random().toString(36).substr(2, 9),
            original: item.base64,
            final: finalUrl,
            timestamp: Date.now(),
          });

          const count = await db.history.count();
          if (count > 20) {
            const oldest = await db.history.orderBy('timestamp').limit(count - 20).toArray();
            await db.history.bulkDelete(oldest.map(i => i.id));
          }
        } catch (e) {
          console.error("Failed to save to IndexedDB:", e);
        }

        setQueue(prev => prev.map(i => i.id === itemId ? { ...i, status: 'completed', result: finalUrl } : i));
      } catch (error: unknown) {
        console.error(`Processing failed for ${item.name}:`, error);
        const errorMessage = error instanceof Error && error.message ? error.message : "AI processing failed.";
        setQueue(prev => prev.map(i => i.id === itemId ? { ...i, status: 'error', error: errorMessage } : i));
      } finally {
        setIsProcessingBatch(false);
      }
    };

    if (!isProcessingBatch && queue.some(item => item.status === 'pending')) {
      const nextItem = queue.find(item => item.status === 'pending');
      if (!nextItem) return;
      void processItem(nextItem.id);
    }
  }, [
    queue,
    isProcessingBatch,
    backgroundImage,
    backgroundImageMimeType,
    systemInstruction,
    isolationPrompt,
    compositionPrompt,
  ]);

  const retryItem = (itemId: string) => {
    setQueue(prev => prev.map(i => i.id === itemId ? { ...i, status: 'pending', error: undefined, stage: undefined } : i));
  };

  const removeItem = (itemId: string) => {
    setQueue(prev => prev.filter(i => i.id !== itemId));
  };

  const clearQueue = () => {
    setQueue(prev => prev.filter(item => item.status === 'processing'));
  };

  const deleteFromHistory = async (id: string) => {
    try {
      await db.history.delete(id);
      await db.galleryItems.where('historyId').equals(id).delete();
    } catch (e) {
      console.error("Failed to delete from IndexedDB:", e);
    }
  };

  const createGallery = async () => {
    const name = newGalleryName.trim();
    if (!name) return;
    try {
      await db.galleries.add({
        id: Math.random().toString(36).substr(2, 9),
        name,
        createdAt: Date.now(),
      });
      setNewGalleryName('');
    } catch (e) {
      console.error("Failed to create gallery:", e);
    }
  };

  const addToGallery = async (galleryId: string, historyId: string) => {
    const existing = await db.galleryItems.where({ galleryId, historyId }).count();
    if (existing > 0) return;
    try {
      await db.galleryItems.add({
        id: Math.random().toString(36).substr(2, 9),
        galleryId,
        historyId,
        addedAt: Date.now(),
      });
    } catch (e) {
      console.error("Failed to add to gallery:", e);
    }
  };

  const removeFromGallery = async (galleryItemId: string) => {
    try {
      await db.galleryItems.delete(galleryItemId);
    } catch (e) {
      console.error("Failed to remove from gallery:", e);
    }
  };

  const deleteGallery = async (galleryId: string) => {
    try {
      await db.galleryItems.where('galleryId').equals(galleryId).delete();
      await db.galleries.delete(galleryId);
      if (selectedGalleryId === galleryId) setSelectedGalleryId(null);
    } catch (e) {
      console.error("Failed to delete gallery:", e);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <header className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <Car className="text-white w-7 h-7" />
        </div>
        <div>
          <h1 className="font-bold text-2xl text-gray-900">AutoStudio <span className="text-blue-600">Pro</span></h1>
          <p className="text-sm text-gray-500 font-medium">AI Automotive Pipeline</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Upload Vehicle</h2>
            </div>

            <div className="space-y-6">
              <ImageUploader onImagesSelect={handleImagesSelect} disabled={isProcessingBatch} />
              
              {queue.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                      <Loader2 className={`w-4 h-4 ${isProcessingBatch ? 'animate-spin text-blue-600' : 'text-gray-400'}`} />
                      Processing Queue ({queue.length})
                    </h3>
                    <button 
                      onClick={clearQueue}
                      className="text-[10px] uppercase font-bold text-gray-500 hover:text-red-500 transition-colors"
                    >
                      Clear Finished
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    <AnimatePresence mode="popLayout">
                      {queue.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="bg-gray-50 rounded-lg p-3 flex items-center justify-between gap-4 border-l-4 border-l-transparent data-[status=processing]:border-l-blue-500 data-[status=completed]:border-l-green-500 data-[status=error]:border-l-red-500"
                          data-status={item.status}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                              <img src={item.base64} className="w-full h-full object-cover opacity-80" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-700 truncate">{item.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {item.status === 'pending' && <span className="text-[10px] text-gray-500 uppercase font-bold">Waiting...</span>}
                                {item.status === 'processing' && (
                                  <span className="text-[10px] text-blue-600 uppercase font-bold animate-pulse">
                                    {item.stage === 'isolation' ? 'Stage 1: Isolating' : 'Stage 2: Composing'}
                                  </span>
                                )}
                                {item.status === 'completed' && <span className="text-[10px] text-green-600 uppercase font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</span>}
                                {item.status === 'error' && <span className="text-[10px] text-red-500 uppercase font-bold truncate">{item.error}</span>}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {item.status === 'error' && (
                              <button 
                                onClick={() => retryItem(item.id)}
                                className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-blue-600 rounded transition-colors"
                                title="Retry"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}
                            {item.status !== 'processing' && (
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-red-500 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 px-2">
              <History className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-800">Recent Processing</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group"
                  >
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      <img 
                        src={item.final} 
                        alt="Processed car" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 gap-2">
                        <a 
                          href={item.final} 
                          download={`car-${item.id}.png`}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-md transition-colors text-white"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <div className="relative">
                          <button 
                            type="button"
                            onClick={() => setAddToGalleryHistoryId(addToGalleryHistoryId === item.id ? null : item.id)}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-md transition-colors text-white"
                            title="Add to gallery"
                          >
                            <FolderPlus className="w-4 h-4" />
                          </button>
                          {addToGalleryHistoryId === item.id && galleries.length > 0 && (
                            <div className="absolute left-0 bottom-full mb-1 py-1 bg-gray-900 rounded-lg shadow-lg min-w-[140px] z-10">
                              {galleries.map((g) => (
                                <button
                                  key={g.id}
                                  type="button"
                                  onClick={() => { void addToGallery(g.id, item.id); setAddToGalleryHistoryId(null); }}
                                  className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700"
                                >
                                  {g.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => deleteFromHistory(item.id)}
                          className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden bg-gray-50">
                          <img src={item.original} className="w-full h-full object-cover opacity-75" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="text-xs font-mono text-gray-500">ID: {item.id}</p>
                          <p className="text-[10px] text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                        Processed
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {history.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
                  <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No processed images yet.</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 px-2">
              <FolderOpen className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-800">Galleries</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGalleryName}
                  onChange={(e) => setNewGalleryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createGallery()}
                  placeholder="New gallery name"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={createGallery}
                  disabled={!newGalleryName.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Plus className="w-4 h-4" />
                  Create
                </button>
              </div>

              {galleries.length === 0 ? (
                <div className="py-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
                  <FolderPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No galleries yet. Create one and add images from Recent Processing.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {galleries.map((gallery) => {
                    const isSelected = selectedGalleryId === gallery.id;
                    return (
                      <div
                        key={gallery.id}
                        className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedGalleryId(isSelected ? null : gallery.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-800">{gallery.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {galleryItemCounts[gallery.id] ?? 0} image{(galleryItemCounts[gallery.id] ?? 0) !== 1 ? 's' : ''}
                            </span>
                            <FolderOpen className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                          </div>
                        </button>
                        {isSelected && (
                          <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-700">Images in this gallery</span>
                              <button
                                type="button"
                                onClick={() => deleteGallery(gallery.id)}
                                className="text-xs font-medium text-red-600 hover:text-red-700"
                              >
                                Delete gallery
                              </button>
                            </div>
                            {selectedGalleryItems.length === 0 ? (
                              <p className="text-sm text-gray-500 py-4">No images. Add from Recent Processing.</p>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {selectedGalleryItems.map(({ galleryItem, history: hist }) => (
                                  <div key={galleryItem.id} className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-video">
                                    <img src={hist.final} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                      <a href={hist.final} download className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30">
                                        <Download className="w-4 h-4" />
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => removeFromGallery(galleryItem.id)}
                                        className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-500"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <PromptSettings 
                systemInstruction={systemInstruction}
                isolationPrompt={isolationPrompt}
                compositionPrompt={compositionPrompt}
                backgroundImage={backgroundImage}
                setSystemInstruction={setSystemInstruction}
                setIsolationPrompt={setIsolationPrompt}
                setCompositionPrompt={setCompositionPrompt}
                setBackgroundImage={handleSetBackgroundImage}
                onReset={resetPrompts}
              />
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <Info className="w-4 h-4 text-blue-500" />
                Pipeline Info
              </h3>
              <ul className="space-y-3 text-xs text-gray-600">
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Stage 1 uses Gemini 3.1 Flash Image to intelligently mask the vehicle.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Stage 2 performs semantic composition into the target studio environment.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Results are stored locally. Use Galleries to organise processed images.</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
