package tn.esprit.microservice.commande.services;

import org.keycloak.TokenVerifier;
import org.keycloak.common.VerificationException;
import org.keycloak.representations.AccessToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class KeycloakJwtValidationService {

    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    public boolean validateToken(String tokenString) {
        try {
            AccessToken token = TokenVerifier.create(tokenString, AccessToken.class)
                    .withChecks(
                            TokenVerifier.SUBJECT_EXISTS_CHECK,
                            TokenVerifier.IS_ACTIVE
                    )
                    .verify()
                    .getToken();

            return token != null &&
                    token.isActive() &&
                    token.getIssuer().equals(authServerUrl + "/realms/" + realm);

        } catch (VerificationException e) {
            return false;
        }
    }
}