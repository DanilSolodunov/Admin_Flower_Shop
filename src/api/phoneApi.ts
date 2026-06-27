import axios from "axios";
import { tokenService } from "./api";

const API_URL = "http://localhost:8080/api";

export const phoneApi = {

    getPhone: async () => {
        const token = tokenService.getAccessToken();

        const response = await axios.get(`${API_URL}/settings/phone`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    },

    savePhone: async (phone: string) => {
        const token = tokenService.getAccessToken();

        await axios.post(
            `${API_URL}/settings/phone`,
            null,
            {
                params: {
                    phone,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    },
};