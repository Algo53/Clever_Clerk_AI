import apiClient from "./apiClient"

export const AuthService = {
    login: async ({ login, password }: { login: string, password: string }) => {
        const response = await apiClient.post('auth/login/', {
            login, password
        });
        return response;
    },
    register: async ({ name, username, email, password }: { name: string, username: string, email: string, password: string }) => {
        const response = await apiClient.post('auth/register/', {
            name, username, password, email
        });
        return response;
    }
}