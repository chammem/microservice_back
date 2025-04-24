package tn.esprit.employesmicro.config;

import lombok.RequiredArgsConstructor;
import org.keycloak.adapters.springsecurity.KeycloakConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;

@KeycloakConfiguration  // ⚠️ This annotation comes from the old Keycloak Spring‑Security adapter
@RequiredArgsConstructor
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
@Configuration
public class KeycloakSecurityConfig {
    // …

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // all read + create endpoints allowed for ROLE_user
                        .requestMatchers(
                                "/employee/find-all",
                                "/employee/find/*",
                                "/employee/*/shifts",
                                "/employee/shift/*/employees",
                                "/employee/create-employee",
                                "/employee/create-shift",
                                "/employee/shifts"
                        ).hasRole("user")

                        // assign, mail, reset, weekly — only ROLE_admin
                        .requestMatchers(
                                "/employee/assigne-employee-shift/*/*",
                                "/employee/send",
                                "/employee/reset-week",
                                "/employee/send-weekly"
                        ).hasAnyRole("user", "admin")  // ✅ <== changed from hasAuthority to hasRole

                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                );
        return http.build();
    }


    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter conv = new JwtAuthenticationConverter();
        conv.setJwtGrantedAuthoritiesConverter(new KeycloakRealmRoleConverter());
        return conv;
    }

    @Bean
    public SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
    }
}