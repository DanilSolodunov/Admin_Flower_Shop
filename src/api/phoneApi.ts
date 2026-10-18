import { api } from "./api";

export const phoneApi = {
  getPhone: async () => {
    return api.get("/settings/phone").then((response) => response.data);
  },

  savePhone: async (phone: string) => {
    await api.post(
      "/settings/phone",
      null,
      {
        params: {
          phone,
        },
      }
    );
  },
};
