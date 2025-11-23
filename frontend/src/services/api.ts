import axios from 'axios';
import type { Deck, ApiResponse, GenerateDeckRequest } from '../types';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const deckService = {
    // Generate or fetch a deck
    async generateDeck(request: GenerateDeckRequest): Promise<ApiResponse<Deck>> {
        const { data } = await api.post<ApiResponse<Deck>>('/generate', request);
        return data;
    },

    // Get all decks
    async getAllDecks(): Promise<ApiResponse<Deck[]>> {
        const { data } = await api.get<ApiResponse<Deck[]>>('/decks');
        return data;
    },

    // Delete a deck
    async deleteDeck(id: string): Promise<ApiResponse<Deck>> {
        const { data } = await api.delete<ApiResponse<Deck>>(`/decks/${id}`);
        return data;
    },

    // Update deck progress
    async updateDeckProgress(id: string, progress: number): Promise<ApiResponse<Deck>> {
        const { data } = await api.patch<ApiResponse<Deck>>(`/decks/${id}/progress`, { progress });
        return data;
    },

    // Health check
    async healthCheck(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
        const { data } = await api.get('/health');
        return data;
    },
};
