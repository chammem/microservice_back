package tn.esprit.microservice.commande.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import tn.esprit.microservice.commande.entities.ArticlePanier;
import tn.esprit.microservice.commande.entities.Commande;
import tn.esprit.microservice.commande.entities.StatutCommande;
import tn.esprit.microservice.commande.entities.StatutPaiement;
import tn.esprit.microservice.commande.repositories.CommandeRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CommandeService {
    @Autowired
    private CommandeRepository commandeRepository;

    public Commande createCommande(Commande commande) {
        return commandeRepository.save(commande);  // Sauvegarde la commande dans la base de données
    }


    public Optional<Commande> getCommande(Long id) {
        return commandeRepository.findById(id);
    }

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }


    public Commande updateStatutCommande(Long id, StatutCommande statut) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'ID : " + id));

        commande.setStatutCommande(statut);

        return commandeRepository.save(commande);
    }

    public void deleteCommande(Long id) {
        commandeRepository.deleteById(id);
    }

    public String processPayment(Commande commande) {
        // Logique pour appeler un service de paiement externe
        return "Paiement réussi";
    }


//////////////////////////////////////////////////////////////////////////////////

    // Simuler un panier statique
    public List<ArticlePanier> getPanierStatique() {
        return List.of(
                new ArticlePanier(1,"Article 1", 2, 10.0), // 2 x 10.0 = 20.0
                new ArticlePanier(1,"Article 2", 1, 15.0)  // 1 x 15.0 = 15.0
        );
    }

    // Calculer le total du panier
    public double calculerTotalPanier(List<ArticlePanier> panier) {
        return panier.stream()
                .mapToDouble(article -> article.getQuantite() * article.getPrix())
                .sum();
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

    // Enregistrer la commande
    public Commande enregistrerCommande(Commande commande) {
        try {
            commande.setStatutPaiement(StatutPaiement.EN_ATTENTE);
            commande.setStatutCommande(StatutCommande.EN_COURS);
            return commandeRepository.save(commande);
        } catch (DataIntegrityViolationException e) {
            // Journaliser l'erreur
            System.err.println("Erreur de base de données : " + e.getMessage());
            throw e;
        }
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
}
