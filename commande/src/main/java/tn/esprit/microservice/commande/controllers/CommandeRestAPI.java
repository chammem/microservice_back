package tn.esprit.microservice.commande.controllers;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.KeycloakPrincipal;
import org.keycloak.KeycloakSecurityContext;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tn.esprit.microservice.commande.entities.ArticlePanier;
import tn.esprit.microservice.commande.entities.Commande;
import tn.esprit.microservice.commande.entities.StatutCommande;
import tn.esprit.microservice.commande.repositories.CommandeRepository;
import tn.esprit.microservice.commande.services.CommandeService;
import tn.esprit.microservice.commande.services.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.FieldError;
import java.net.URI;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/commandes")
public class CommandeRestAPI {

    @Autowired
    private CommandeService commandeService;

    @Autowired
    private EmailService emailService;

    private static final Logger log = LoggerFactory.getLogger(CommandeRestAPI.class);

    @PostMapping("/useradd")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Commande> createCommande(
            @RequestBody @Valid Commande commande) {

        // Définir les valeurs par défaut si nécessaire
        if (commande.getStatutCommande() == null) {
            commande.setStatutCommande(StatutCommande.EN_COURS);
        }

        Commande newCommande = commandeService.createCommande(commande);
        return ResponseEntity.ok(newCommande);
    }
    @DeleteMapping("/{id}")
    @RequestMapping("/admin")
    public ResponseEntity<Void> deleteCommande(@PathVariable Long id, KeycloakAuthenticationToken auth) {
        KeycloakPrincipal<KeycloakSecurityContext> principal =
                (KeycloakPrincipal<KeycloakSecurityContext>) auth.getPrincipal();

        KeycloakSecurityContext context = principal.getKeycloakSecurityContext();

        boolean hasUserRole = context.getToken().getRealmAccess().getRoles().contains("admin");

        if (hasUserRole) {
            commandeService.deleteCommande(id);  // Suppression sans retour
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/{id}")
    public Optional<Commande> getCommande(@PathVariable Long id) {

            return commandeService.getCommande(id);


        }


    @GetMapping("/user")
    @PreAuthorize("hasAnyRole('user') or hasAnyAuthority('SCOPE_user')")
    public ResponseEntity<List<Commande>> getUserCommandes(@AuthenticationPrincipal Jwt jwt) {
        // Log supplémentaire pour débogage
        log.info("User roles: {}", jwt.getClaimAsStringList("realm_access.roles"));

        List<Commande> commandes = commandeService.getAllCommandes();
        return ResponseEntity.ok(commandes);
    }

    @PutMapping("/{id}/statut")
    public Commande updateStatutCommande(@PathVariable Long id, @RequestParam StatutCommande statut) {
        return commandeService.updateStatutCommande(id, statut);
    }





    // 1. Récupérer un panier statique
    @GetMapping("/panier-statique")
    public List<ArticlePanier> getPanierStatique() {
        return commandeService.getPanierStatique();
    }

    // 2. Calculer le total du panier
    @PostMapping("/calculer-total")
    public double calculerTotalPanier(@RequestBody List<ArticlePanier> panier) {
        return commandeService.calculerTotalPanier(panier);
    }

    // 3. Valider une commande
    @PostMapping("/valider-commande")
    public void validerCommande(@RequestBody List<ArticlePanier> panier) {
        commandeService.validerCommande(panier);
    }

    // 4. Traiter un paiement
    @PostMapping("/traiter-paiement")
    public String traiterPaiement(@RequestParam double montant) {
        return commandeService.traiterPaiement(montant);
    }

    // 5. Enregistrer une commande
    @PostMapping("/enregistrer-commande")
    public ResponseEntity<?> enregistrerCommande(@RequestBody Commande commande) {
        try {
            Commande nouvelleCommande = commandeService.enregistrerCommande(commande);

            if (nouvelleCommande.getEmail() != null) {
                String sujet = "Confirmation de votre commande #" + nouvelleCommande.getId();
                String texte = String.format(
                        "Merci pour votre commande !\n\nDétails de la commande :\nNom : %s\nTotal : %.2f €\nStatut : %s",
                        nouvelleCommande.getNomClient(), nouvelleCommande.getTotalCommande(), nouvelleCommande.getStatutCommande()
                );

                emailService.envoyerEmailConfirmation(nouvelleCommande.getEmail(), sujet, texte);
            }

            return ResponseEntity.ok(nouvelleCommande);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur de base de données : " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();  // Important pour voir l'erreur complète
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur s'est produite.");
        }
    }



    // 6. Mettre à jour l'historique
    @PostMapping("/mettre-a-jour-historique")
    public void mettreAJourHistorique(@RequestBody Commande commande) {
        commandeService.mettreAJourHistorique(commande);
    }

    // 7. Passer une commande complète
    @PostMapping("/passer-commande")
    public Commande passerCommande(
            @RequestParam String nomClient,
            @RequestParam String adresseClient) {
        return commandeService.passerCommande(nomClient, adresseClient);
    }
}
