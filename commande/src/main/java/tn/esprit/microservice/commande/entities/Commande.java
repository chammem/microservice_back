package tn.esprit.microservice.commande.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomClient;
    private String prenomClient; // Ajout
    private String adresseClient;
    private String codePostal; // Ajout
    private String telephone; // Ajout
    private String email; // Ajout
    private String notes; // Ajout

    @Enumerated(EnumType.STRING)
    private StatutCommande statutCommande ; // Valeur par défaut

    @Enumerated(EnumType.STRING)
    private StatutPaiement statutPaiement ;

    private double totalCommande;

    @OneToMany(cascade = CascadeType.ALL)
    private List<ArticlePanier> articlesPanier;

    public List<ArticlePanier> getArticlesPanier() {
        return articlesPanier;
    }

    public void setArticlesPanier(List<ArticlePanier> articlesPanier) {
        this.articlesPanier = articlesPanier;
    }
}