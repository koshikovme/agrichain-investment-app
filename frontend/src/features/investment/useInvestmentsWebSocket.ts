import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { useAppDispatch } from "../../app/hooks";
import { setInvestments } from "./investmentsSlice";
import { keycloak } from "../auth/keycloak";

export const useInvestmentsWebSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!keycloak.token) {
      console.error("Keycloak token is not available");
      return;
    }

    const client = new Client({
      // Use the correct gateway port (8072) as mentioned in your setup
      brokerURL: "ws://gatewayserver:8072/ws/investments",
      connectHeaders: {
        Authorization: `Bearer ${keycloak.token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // Add debug logging
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
      console.log("WebSocket connected for investments", frame);

      client.subscribe("/topic/investments", (message) => {
        try {
          const investments = JSON.parse(message.body);
          dispatch(setInvestments(investments));
        } catch (error) {
          console.error("Error parsing investments message:", error);
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