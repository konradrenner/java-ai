package org.kore.java.ai.jakarta.hello;

import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.ApplicationPath;

@ApplicationPath("")
public class HelloApplication extends Application {
    // Needed to enable Jakarta REST and specify path.
}
