import { create } from 'zustand';

import * as api from '@/services/api';
import { DUMMY_CATEGORIES } from '@/lib/constants';
import { ApiStatus, Category, ContextEntry } from "@/types";

interface ContextStoreState {
    categories: Category[];
    contextEntries: ContextEntry[];

    getAllContext: () => Promise<ApiStatus>;
    addContextEntry: () => void;
}

export const contextStore = create<ContextStoreState>((set, get) => ({
    categories: [...DUMMY_CATEGORIES],
    contextEntries: [],

    getAllContext: async () => {
        try {
            const response = await api.getContextEntries();
            set({ contextEntries: response });
            return {
                status: true,
                errorText: null,
                successText: 'Context retrieved successfully',
            }
        } catch (error: any) {
            return {
                status: false,
                successText: null,
                errorText: 'Error while retrieving context. Please try again.',
            }
        }
    },
    addContextEntry: () => {

    }
}))