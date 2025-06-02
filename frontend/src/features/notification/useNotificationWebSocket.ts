// useNotificationWebSocket.ts
import { useEffect, useState } from "react";
import { socket } from "../../features/notification/websocketNotificationListener";

export const useNotificationWebSocket = (userId: number) => {
    const [notification, setNotification] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const handleOpen = () => {
            socket.send(JSON.stringify({ user_id: userId }));
        };

        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data && typeof data === "object" && "subject" in data && "body" in data) {
                    const formattedBody = data.body.replace(/\n/g, "<br />");
                    setNotification(`${data.subject}<br /><br />${formattedBody}`);
                    setOpen(true);
                } else {
                    console.warn("Unexpected WebSocket message format:", data);
                }
            } catch (error) {
                console.error("Failed to parse WebSocket message:", event.data, error);
            }
        };


        if (socket.readyState === WebSocket.OPEN) {
            handleOpen();
        } else {
            socket.addEventListener("open", handleOpen);
        }

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("open", handleOpen);
            socket.removeEventListener("message", handleMessage);
        };
    }, [userId]);

    const handleClose = () => setOpen(false);

    return {
        open,
        notification,
        handleClose,
    };
};
