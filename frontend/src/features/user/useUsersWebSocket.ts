import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { useAppDispatch } from "../../app/hooks";
import {setUsers} from "./userSlice";
import { keycloak } from "../auth/keycloak";

export const useUserWebSocket = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!keycloak.token) {
            console.error("Keycloak token is not available");
            return;
        }

        const client = new Client({
            brokerURL: `ws://localhost:8072/ws/users?token=${keycloak.token}`,
            // connectHeaders: {
            //     Authorization: `Bearer ${keycloak.token}`,
            // },
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

        client.onConnect = (frame) => {
            console.log("WebSocket connected for users", frame);

            client.subscribe("/topic/users", (message) => {
                try {
                    const users = JSON.parse(message.body);
                    dispatch(setUsers(users));
                } catch (error) {
                    console.error("Error parsing user message:", error);
                }
            });
        };

        client.onDisconnect = () => {
            console.log("WebSocket disconnected");
        };

        client.activate();

        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, [dispatch, keycloak]);
};