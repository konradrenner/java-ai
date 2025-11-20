package org.kore.java.ai.bb8;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.Instant;
/**
 *
 * @author koni
 */
public record PromptResponse(@NotBlank
        String prompt, @NotBlank
        String response, @NotNull
        @PastOrPresent
        Instant timestamp) {

}
