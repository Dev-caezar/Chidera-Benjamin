import { NotificationResponse, NotificationItem } from "@/types/notification";
import { request } from "./http";

export const notificationsApi = {
  async getAll(limit = 100): Promise<NotificationItem[]> {
    const data = await request<NotificationResponse>(
      `/api/notifications?limit=${limit}`,
    );
    return data.data;
  },
  markRead: (id: string) =>
    request(`/api/notifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ read: true }),
    }),
  markAllRead: () => request("/api/notifications", { method: "PATCH" }),
  remove: (id: string) =>
    request(`/api/notifications/${id}`, { method: "DELETE" }),
  reply: (id: string, message: string) =>
    request(`/api/notifications/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
