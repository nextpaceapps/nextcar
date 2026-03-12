import { requestJson } from './api';

export interface ProcessResult {
  imageUrl: string;
  stage: 'isolation' | 'composition';
}

export async function processCarImage(
  base64Image: string,
  mimeType: string,
  systemInstruction: string,
  isolationPrompt: string,
  compositionPrompt: string,
  backgroundImage: string | null,
  backgroundImageMimeType: string | null,
  onProgress: (stage: 'isolation' | 'composition') => void
): Promise<string> {
  // Stage 1: Isolation
  onProgress('isolation');
  const { data: isolationData } = await requestJson<{ isolatedImage: string }>('/api/ai/autostudio/isolate', {
    method: 'POST',
    body: JSON.stringify({
      base64Image,
      mimeType,
      systemInstruction,
      isolationPrompt
    })
  });
  const isolatedBase64 = isolationData.isolatedImage;

  // Stage 2: Composition
  onProgress('composition');
  const { data: compositionData } = await requestJson<{ finalImage: string }>('/api/ai/autostudio/compose', {
    method: 'POST',
    body: JSON.stringify({
      isolatedBase64,
      compositionPrompt,
      systemInstruction,
      backgroundImage,
      backgroundImageMimeType
    })
  });
  return compositionData.finalImage;
}
