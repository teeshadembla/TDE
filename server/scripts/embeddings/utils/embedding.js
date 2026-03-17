import { pipeline } from '@xenova/transformers';

let embeddingPipeline = null;

// Load model once and reuse it
async function getEmbeddingPipeline() {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return embeddingPipeline;
}

export async function generateEmbedding(text) {
  if (!text || !text.trim()) {
    return null;
  }

  const extractor = await getEmbeddingPipeline();

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true
  });

  // Convert TypedArray -> normal JS array
  return Array.from(output.data);
}