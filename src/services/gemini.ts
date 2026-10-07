import { CategoryType } from '../types';

export interface ServerDetectedItem {
  detectedName: string;
  category: CategoryType;
  condition: 'PRISTINE' | 'LIGHT WEAR' | 'MINOR FAULT' | 'HEAVILY DAMAGED' | 'PARTS ONLY';
  detectedBrand: string;
  detectedFault: string;
  confidence: number;
  estimatedAgeYears: number;
}

export async function analyzeItemWithServer(
  imageBase64: string,
  userNotes?: string
): Promise<ServerDetectedItem> {
  const response = await fetch('/api/analyze-item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      imageBase64,
      userNotes
    })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const errorMsg = data.error || 'Gemini image analysis is currently unavailable.';
    throw new Error(errorMsg);
  }

  return {
    detectedName: data.detectedName,
    category: data.category,
    condition: data.condition,
    detectedBrand: data.detectedBrand,
    detectedFault: data.detectedFault,
    confidence: data.confidence,
    estimatedAgeYears: data.estimatedAgeYears || 2
  };
}
