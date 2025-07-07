import { getAuthToken, removeAuthToken, setAuthToken } from "@/utils/cookies";
import { create } from "zustand";

interface AuthStoreState {
    token: string | null;
    isHydrated: boolean;

    hydrate: () => void;
    loginEndPoint: (token: string) => Promise<void>;
    logoutEndPoint: () => Promise<void>;
}

export const authStore = create<AuthStoreState>((set, get) => ({
    token: null,
    isHydrated: false,

    hydrate: () => {
        const token = getAuthToken() ?? null;
        set({
            token,
            isHydrated: true
        });
    },
    loginEndPoint: async (token: string) => {
        setAuthToken(token);
        set({ token });
    },
    logoutEndPoint: async () => {
        removeAuthToken();
        set({ token: null });
    }
}))