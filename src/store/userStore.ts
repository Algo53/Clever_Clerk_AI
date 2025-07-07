import { create } from "zustand";
import { ApiStatus, User } from "@/types";
import { UserService } from "@/services/userService";

interface UserStoreState {
    user: User | null;

    getUserDetails: () => Promise<ApiStatus>;
}

export const userStore = create<UserStoreState>((set, get) => ({
    user: null,

    getUserDetails: async () => {
        try {
            const response = await UserService.getUserDetails();
            if (response.status === 200) {
                set({ user: response.data});
                return {
                    status: true,
                    errorText: null,
                    successText: 'User details fetched successfully',
                }
            } else {
                return {
                    status: true,
                    successText: null,
                    errorText: "Failed to fetch user details. Enter a valid authtoken",
                }
            }
        } catch (error: any) {
            return {
                status: true,
                successText: null,
                errorText: error.message || "Failed to fetch user details. Please try again",
            }

        }
    }
}))