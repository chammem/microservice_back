package tn.esprit.microservice.commande.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import tn.esprit.microservice.commande.entities.*;
import tn.esprit.microservice.commande.repositories.CommandeRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.stripe.model.Charge;

@Service
public class CommandeService {


    private final CommandeRepository commandeRepository;
    private final StripeService stripeService;
    private final EmailService emailService;

    public CommandeService(CommandeRepository commandeRepository,
                           StripeService stripeService,
                           EmailService emailService) {
        this.commandeRepository = commandeRepository;
        this.stripeService = stripeService;
        this.emailService = emailService;
    }

    public List<ArticlePanier> getPanierStatique() {
        return List.of(
                new ArticlePanier(1L, "Article 1", 2, 10.0),
                new ArticlePanier(2L, "Article 2", 1, 15.0)
        );
    }

    // Calculer le total du panier
    public double calculerTotalPanier(List<ArticlePanier> panier) {
        return panier.stream()
                .mapToDouble(article -> article.getQuantite() * article.getPrix())
                .sum();
    }

    // Enregistrer la commande
    public Commande enregistrerCommande(Commande commande) {
        try {
            // Calculer et assigner le total de la commande
            commande.setTotalCommande(this.calculerTotalPanier(commande.getArticlesPanier()));
            commande.setStatutPaiement(StatutPaiement.EN_ATTENTE);
            commande.setStatutCommande(StatutCommande.EN_COURS);

            Commande savedCommande = commandeRepository.save(commande);

            return savedCommande;
        } catch (DataIntegrityViolationException e) {
            // Journaliser l'erreur avec des détails supplémentaires
            System.err.println("Erreur de base de données lors de l'enregistrement de la commande : " + e.getMessage());
            throw e;  // Rethrow l'exception pour propagation
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<Commande> getCommandeById(@PathVariable Long id) {
        Optional<Commande> commande = commandeRepository.findById(id);
        return commande
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    public void saveCommande(Commande commande) {
        commandeRepository.save(commande);  // Sauvegarde la commande
    }


    // Mettre à jour l'historique (simulé)
    public void mettreAJourHistorique(Commande commande) {
        System.out.println("Historique mis à jour pour la commande : " );
    }

    // Fonction principale pour passer une commande
    public Commande passerCommande(String nomClient, String adresseClient) {
        // 1. Récupérer le panier (statique pour l'instant)
        List<ArticlePanier> panier = this.getPanierStatique();

        // Vérifier que le panier n'est pas vide
        if (panier == null || panier.isEmpty()) {
            throw new IllegalArgumentException("Le panier est vide.");
        }

        // 2. Valider la commande
        this.validerCommande(panier);

        // 3. Calculer le total du panier
        double totalCommande = this.calculerTotalPanier(panier);

        // 4. Traiter le paiement
        String statutPaiement = this.traiterPaiement(totalCommande);

        // 5. Créer l'objet Commande
        Commande commande = new Commande();
        commande.setNomClient(nomClient);
        commande.setAdresseClient(adresseClient);
        commande.setTotalCommande(totalCommande);
        commande.setStatutPaiement(StatutPaiement.valueOf(statutPaiement)); // Convertir le statut en enum
        commande.setStatutCommande(StatutCommande.VALIDEE);

        // 6. Enregistrer la commande
        Commande commandeEnregistree = this.enregistrerCommande(commande);

        // 7. Mettre à jour l'historique
        this.mettreAJourHistorique(commandeEnregistree);

        return commandeEnregistree;
    }

    // Valider la commande
    public void validerCommande(List<ArticlePanier> panier) {
        if (panier.isEmpty()) {
            throw new RuntimeException("Le panier est vide");
        }
    }

    // Traiter le paiement (simulé)
    public String traiterPaiement(double montant) {
        // Simuler un paiement réussi
        return "PAYE";
    }
}
