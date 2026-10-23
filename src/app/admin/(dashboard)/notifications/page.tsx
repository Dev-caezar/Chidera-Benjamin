// src/app/admin/(dashboard)/notifications/page.tsx
import NotificationsListClient from "@/components/admin/NotificationsListClient";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/model/Notification";

export default async function NotificationsPage() {
    await connectDB();
    const notifications = await Notification.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

    return (
        <NotificationsListClient
            notifications={JSON.parse(JSON.stringify(notifications))}
        />
    );
}