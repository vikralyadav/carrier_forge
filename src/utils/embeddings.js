import { createOllamaClient } from "../core/ollamaClient.js";

const ollamaClient = createOllamaClient("mistral");

/**
 * Generate embeddings for text using Ollama
 * Note: This is a simplified implementation. For production,
 * consider using a dedicated embedding model or service.
 */
export const generateEmbedding = async (text) => {
    try {
        // For now, we'll use a simple text processing approach
        // In a real implementation, you'd use a proper embedding model
        const prompt = `
        Convert this text into a numerical representation for similarity matching:
        "${text}"
        
        Return a JSON array of numbers representing the text embedding.
        `;
        
        const response = await ollamaClient.generate(prompt);
        
        // Parse the response and extract numbers
        const numbers = response.match(/-?\d+\.?\d*/g);
        if (numbers && numbers.length > 0) {
            return numbers.map(Number);
        }
        
        // Fallback: create a simple hash-based embedding
        return createSimpleEmbedding(text);
        
    } catch (error) {
        console.error("Error generating embedding:", error);
        return createSimpleEmbedding(text);
    }
};

/**
 * Create a simple embedding based on text characteristics
 * This is a fallback method for when Ollama embedding fails
 */
const createSimpleEmbedding = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(50).fill(0);
    
    // Simple word frequency and length-based embedding
    words.forEach(word => {
        const hash = word.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        const index = Math.abs(hash) % embedding.length;
        embedding[index] += 1;
    });
    
    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
        return embedding.map(val => val / magnitude);
    }
    
    return embedding;
};

/**
 * Calculate cosine similarity between two embeddings
 */
export const cosineSimilarity = (embedding1, embedding2) => {
    if (embedding1.length !== embedding2.length) {
        return 0;
    }
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
        dotProduct += embedding1[i] * embedding2[i];
        norm1 += embedding1[i] * embedding1[i];
        norm2 += embedding2[i] * embedding2[i];
    }
    
    if (norm1 === 0 || norm2 === 0) {
        return 0;
    }
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
};

/**
 * Generate embeddings for multiple texts
 */
export const generateEmbeddings = async (texts) => {
    const embeddings = [];
    
    for (const text of texts) {
        const embedding = await generateEmbedding(text);
        embeddings.push(embedding);
    }
    
    return embeddings;
};

/**
 * Find most similar text based on embeddings
 */
export const findMostSimilar = async (queryText, candidateTexts) => {
    const queryEmbedding = await generateEmbedding(queryText);
    const candidateEmbeddings = await generateEmbeddings(candidateTexts);
    
    let bestMatch = { index: -1, similarity: -1 };
    
    candidateEmbeddings.forEach((embedding, index) => {
        const similarity = cosineSimilarity(queryEmbedding, embedding);
        if (similarity > bestMatch.similarity) {
            bestMatch = { index, similarity };
        }
    });
    
    return {
        bestMatch: bestMatch.index >= 0 ? candidateTexts[bestMatch.index] : null,
        similarity: bestMatch.similarity,
        index: bestMatch.index
    };
};
