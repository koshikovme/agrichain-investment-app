import { useEffect, useRef, useState } from "react";

export type WebNotification = {
    id: number;
    subject: string;
    body: string;
};

export const useNotificationWebSocket = (userId: number | null) => {
    const [notifications, setNotifications] = useState<WebNotification[]>([]);
    const [open, setOpen] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!userId) return;

        const socket = new WebSocket("ws://localhost:6969/ws");
        socketRef.current = socket;

        socket.addEventListener("open", () => {
            socket.send(JSON.stringify({ user_id: userId }));
        });

        socket.addEventListener("message", (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);

                // Если пришёл объект с action: "unread_notifications"
                if (
                    data &&
                    typeof data === "object" &&
                    data.action === "unread_notifications" &&
                    Array.isArray(data.data)
                ) {
                    setNotifications(data.data);
                }
                // Если пришёл массив уведомлений (старый формат)
                else if (Array.isArray(data)) {
                    setNotifications(data);
                }
                // Если пришло одно уведомление
                else if (data && typeof data === "object" && "subject" in data && "body" in data && "id" in data) {
                    setNotifications((prev) => [data, ...prev]);
                }
            } catch (error) {
                console.error("Failed to parse WebSocket message:", event.data, error);
            }
        });

        return () => {
            socket.close();
        };
    }, [userId]);

    const markAsRead = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        socketRef.current?.send(JSON.stringify({ is_read: id }));
    };
    
    return {
        notifications,
        open,
        setOpen,
        markAsRead,
    };
};