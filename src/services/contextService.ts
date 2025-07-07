import { ContextEntry } from "@/types";
import apiClient from "./apiClient"

export const ContextService = {
    getAllContext: async() => {
        const response = await apiClient.get('context/');
        return response;
    },
    createContext: async(data: ContextEntry) => {
        const response = await apiClient.post('context/', data);
        return response;
    }
}