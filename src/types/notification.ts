export type NotificationItem = {
  _id: string;
  type: "contact" | "system";
  title: string;
  message?: string;
  read: boolean;
  replied: boolean;
  replies?: { message: string; sentAt: string }[];
  createdAt: string;
  meta?: { email?: string; name?: string };
};
