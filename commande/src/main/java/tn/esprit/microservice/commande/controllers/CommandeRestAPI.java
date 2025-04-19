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
import tn.esprit.microservice.commande.entities.*;
import tn.esprit.microservice.commande.repositories.CommandeRepository;
import tn.esprit.microservice.commande.services.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.FieldError;

import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;
import tn.esprit.microservice.commande.services.StripeService;

@RestController
@RequestMapping("/commandes")
public class CommandeRestAPI {
    @Autowired
    private StripeService stripeService;
    @Autowired
    private CommandeService commandeService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private KeycloakJwtValidationService tokenValidator; // Injection

    @Autowired
    private CommandeRepository commandeRepository;

    private static final Logger log = LoggerFactory.getLogger(CommandeRestAPI.class);
    @GetMapping("/panier-statique")
    public List<ArticlePanier> getPanier() {
        return commandeService.getPanierStatique();
    }

    @PostMapping("/enregistrer-commande")
    @RolesAllowed("user")
    public ResponseEntity<?> enregistrerCommande(@RequestBody Commande commande
            ) {
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

    @GetMapping("/commandes/{id}")
    public ResponseEntity<Commande> getCommandeById(@PathVariable Long id) {
        Optional<Commande> commande = commandeRepository.findById(id);
        return commande
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/commandes/{id}/paiement")
    public ResponseEntity<Commande> updateStatutPaiement(@PathVariable Long id) {
        Optional<Commande> commandeOpt = commandeRepository.findById(id);

        if (!commandeOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Commande commande = commandeOpt.get();
        commande.setStatutPaiement(StatutPaiement.PAYE); // Met à jour le statut du paiement
        commande.setStatutCommande(StatutCommande.VALIDEE); // Optionnel: Modifier le statut de la commande si nécessaire

        commandeRepository.save(commande);  // Sauvegarder les modifications

        return ResponseEntity.ok(commande);
    }


    /*  @GetMapping("/user")
    @PreAuthorize("hasAnyRole('user') or hasAnyAuthority('SCOPE_user')")
    public ResponseEntity<List<Commande>> getUserCommandes(@AuthenticationPrincipal Jwt jwt) {
        // Log supplémentaire pour débogage
        log.info("User roles: {}", jwt.getClaimAsStringList("realm_access.roles"));

        List<Commande> commandes = commandeService.getAllCommandes();
        return ResponseEntity.ok(commandes);
    }
*/
  @PostMapping("/calculerTotal")
  public double calculerTotalPanier(@RequestBody List<ArticlePanier> panier) {
      if (panier == null || panier.isEmpty()) {
          System.err.println("Le panier est vide ou nul.");
          return 0;
      }

      panier.forEach(article -> {
          System.out.println("Article: " + article.getNom() + " Quantité: " + article.getQuantite() + " Prix: " + article.getPrix());
      });

      return panier.stream()
              .mapToDouble(article -> article.getQuantite() * article.getPrix())
              .sum();
  }


    // 5. Enregistrer une commande


  /*  @PostMapping("/create-checkout-session")
    public String createCheckoutSession(@RequestBody PaymentRequest request) {
        System.out.println("Requête reçue : " + request);
        return stripeService.createCheckoutSession(
                request.getAmount(),
                request.getCurrency(),
                request.getSuccessUrl(),
                request.getCancelUrl()
        );
    }*/



    @PostMapping("/checkout")
    public ResponseEntity<String> checkout(@RequestBody Map<String, Object> payload) {
        Long orderId = Long.parseLong(payload.get("orderId").toString());
        List<ArticlePanier> panier = commandeService.getPanierStatique();
        commandeService.validerCommande(panier);
        double total = commandeService.calculerTotalPanier(panier);

        // Créer la session de paiement avec Stripe
        String checkoutUrl = stripeService.createCheckoutSession(
                (long) (total * 100), "eur",
                "http://localhost:4200/confirmation/" + orderId,
                "http://localhost:4200/cancel"
        );
        ResponseEntity<Commande> commandeResponse = commandeService.getCommandeById(orderId);

        // Récupérer la commande et mettre à jour les statuts
        Commande commande = commandeResponse.getBody();
        if (commande != null) {
            commande.setStatutPaiement(StatutPaiement.PAYE);  // Mise à jour du statut de paiement
            commande.setStatutCommande(StatutCommande.VALIDEE);  // Optionnel: Modifier le statut de la commande
            commandeService.saveCommande(commande);  // Sauvegarder la commande avec le nouveau statut
        }

        // Retourner l'URL de Stripe
        return ResponseEntity.ok(checkoutUrl);
    }



/*
    @PostMapping("/payer")
    public ResponseEntity<Map<String, String>> payerCommande(@RequestParam String emailClient) {
        String checkoutUrl = commandeService.creerSessionPaiement(emailClient);

        Map<String, String> response = new HashMap<>();
        response.put("checkoutUrl", checkoutUrl);

        return ResponseEntity.ok(response);
    }*/
}
