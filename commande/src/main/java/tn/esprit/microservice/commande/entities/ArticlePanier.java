package tn.esprit.microservice.commande.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ArticlePanier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    private String nom;
    private int quantite;
    private double prix;

    public ArticlePanier(){}

    public ArticlePanier(long id ,String nom, int quantite, double prix) {
        this.id=id;
        this.nom = nom;
        this.quantite = quantite;
        this.prix = prix;
    }

    // Getters et setters
    public String getId() {
        return nom;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public int getQuantite() {
        return quantite;
    }

    public void setQuantite(int quantite) {
        this.quantite = quantite;
    }

    public double getPrix() {
        return prix;
    }

    public void setPrix(double prix) {
        this.prix = prix;
    }

    @Override
    public String toString() {
        return "ArticlePanier{" +
                "id=" + id + '\'' +
                "nom='" + nom + '\'' +
                ", quantite=" + quantite +
                ", prix=" + prix +
                '}';
    }
}
