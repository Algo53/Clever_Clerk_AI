import { User } from "@/types";
import apiClient from "./apiClient"

export const UserService = {
    getUserDetails: async () => {
        const response = await apiClient.get('user/');
        return response;
    },
    updateUserDetails: async (data: User) => {
        const response = await apiClient.put('user/update/', {
            ...data
        });
        return response;
    },
    deleteUserAccount: async (id: number) => {
        const response = await apiClient.delete('user/');
        return response;
    }
}