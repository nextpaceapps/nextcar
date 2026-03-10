import { BACKEND_URL, getAuthHeaders } from './api';

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
  const headers = await getAuthHeaders();

  // Stage 1: Isolation
  onProgress('isolation');
  const isolationResponse = await fetch(`${BACKEND_URL}/api/ai/autostudio/isolate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      base64Image,
      mimeType,
      systemInstruction,
      isolationPrompt
    })
  });

  if (!isolationResponse.ok) {
    const error = await isolationResponse.json().catch(() => ({ error: isolationResponse.statusText }));
    throw new Error(error.error || "Failed to isolate car in Stage 1");
  }

  const isolationData = await isolationResponse.json();
  const isolatedBase64 = isolationData.isolatedImage;

  // Stage 2: Composition
  onProgress('composition');
  const compositionResponse = await fetch(`${BACKEND_URL}/api/ai/autostudio/compose`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      isolatedBase64,
      compositionPrompt,
      systemInstruction,
      backgroundImage,
      backgroundImageMimeType
    })
  });

  if (!compositionResponse.ok) {
    const error = await compositionResponse.json().catch(() => ({ error: compositionResponse.statusText }));
    throw new Error(error.error || "Failed to compose image in Stage 2");
  }

  const compositionData = await compositionResponse.json();
  return compositionData.finalImage;
}
