package org.kore.java.ai.bb8;

import jakarta.validation.constraints.NotBlank;

/**
 *
 * @author koni
 */
public record PromptRequest(@NotBlank
        String prompt, @NotBlank
        String clientId) {

}
