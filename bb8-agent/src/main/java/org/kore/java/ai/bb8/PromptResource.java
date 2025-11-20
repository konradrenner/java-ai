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

import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.Instant;
import java.util.Objects;

/**
 *
 * @author koni
 */
@Path("/api/prompts")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PromptResource {

    @POST
    public Response handlePrompt(@Valid PromptRequest request) {
        var prompt = request.prompt();

        // TODO den fancy AI shit hier rein bauen
        String answer = "Antwort auf deinen Prompt: " + prompt.toUpperCase();

        PromptResponse response = new PromptResponse(
                prompt,
                answer,
                Instant.now()
        );

        // Nur an diesen Client pushen
        PromptWebSocket.broadcastToClient(request.clientId(), response);

        return Response.accepted().build();
    }
}
