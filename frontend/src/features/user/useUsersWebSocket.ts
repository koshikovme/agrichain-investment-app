import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { useAppDispatch } from "../../app/hooks";
import { setUserInfo } from "../user/userSlice";
import { keycloak } from "../auth/keycloak";

export const useUserWebSocket = (mobileNumber: string) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!keycloak.token || !mobileNumber) return;

        const client = new Client({
            brokerURL: "ws://gatewayserver:8072/ws/users",
            connectHeaders: {
                Authorization: `Bearer ${keycloak.token}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            // Handle connection errors
            onStompError: (frame) => {
                console.error('STOMP Error:', frame);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket Error:', error);
            },
            onWebSocketClose: (event) => {
                console.error('WebSocket Closed:', event);
            },
        });

        client.onConnect = () => {
            console.log("WebSocket connected for user:", mobileNumber);
            client.subscribe(`/topic/users/${mobileNumber}`, (message) => {
                console.log("Received user message:", message.body);
                try {
                    const user = JSON.parse(message.body);
                    dispatch(setUserInfo(user));
                } catch (error) {
                    console.error("Error parsing user message:", error);
                }
            });
        };

        client.activate();

        return () => {
            if (client.active) client.deactivate();
        };
    }, [dispatch, keycloak, mobileNumber]);
};