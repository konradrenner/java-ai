/*
 * Copyright (C) 2025 koni
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.kore.java.ai.bb8;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import static io.quarkus.jsonp.JsonProviderHolder.jsonProvider;
import jakarta.json.JsonValue;
import java.time.ZoneId;

/**
 *
 * TODO generierter Code der fix ueberabeitet gehoert
 *
 * @author koni
 */
@ServerEndpoint("/ws/prompts/{clientId}")
public class PromptWebSocket {

    private static final Map<String, Set<Session>> CLIENTS = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("clientId") String clientId) {
        CLIENTS
                .computeIfAbsent(clientId, id -> ConcurrentHashMap.newKeySet())
                .add(session);

        // Client-ID an die Session haengen (für onClose/onError)
        session.getUserProperties().put("clientId", clientId);
    }

    @OnClose
    public void onClose(Session session) {
        removeSession(session);
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        removeSession(session);
        // TODO otel log 
        throwable.printStackTrace();
    }

    private void removeSession(Session session) {
        Object cid = session.getUserProperties().get("clientId");
        if (cid instanceof String clientId) {
            Set<Session> sessions = CLIENTS.get(clientId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    CLIENTS.remove(clientId);
                }
            }
        } else {
            // Fallback: alle Sets durchsuchen 
            CLIENTS.values().forEach(sessions -> sessions.remove(session));
        }
    }

    public static void broadcastToClient(String clientId, PromptResponse response) {
        Set<Session> sessions = CLIENTS.get(clientId);
        if (sessions == null || sessions.isEmpty()) {
            return;
        }
        String json = jsonProvider().createObjectBuilder()
                .add("prompt", response.prompt())
                .add("response", response.response())
                .add("timestamp", response.timestamp().toEpochMilli())
                .build()
                .toString();
        for (Session session : sessions) {
            if (session.isOpen()) {
                session.getAsyncRemote().sendText(json);
            }
        }
    }
}
