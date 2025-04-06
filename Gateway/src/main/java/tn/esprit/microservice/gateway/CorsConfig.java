package tn.esprit.microservice.gateway;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;

@Configuration
public class CorsConfig {

    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")  // Frontend Angular ou React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Méthodes HTTP autorisées
                .allowedHeaders("*")  // Autoriser tous les headers
                .allowCredentials(true);  // Autorise les credentials (cookies, etc.)
    }
}

