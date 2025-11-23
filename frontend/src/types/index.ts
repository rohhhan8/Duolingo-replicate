export interface Card {
    _id: string;
    question: string;
    answer: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface Deck {
    _id: string;
    topic: string;
    cards: Card[];
    createdAt: string;
    updatedAt?: string;
    progress?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    source?: 'cache' | 'ai';
    count?: number;
}

export interface GenerateDeckRequest {
    topic: string;
}

export interface Skill {
    name: string;
    progress: number;
    color: string;
}

export interface Activity {
    id: string;
    action: string;
    topic: string;
    timestamp: Date;
}
