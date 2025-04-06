package tn.esprit.microservice.commande.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.util.List;

@Entity
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

    // Constructeurs
    public Commande() {}

    public Commande(Long id, String nomClient, String adresseClient, double totalCommande) {
        this.id = id;
        this.nomClient = nomClient;
        this.adresseClient = adresseClient;
        this.totalCommande = totalCommande;
    }

    public Long getId() {
        return id;
    }
    // Getter et Setter pour nomClient
    public String getNomClient() {
        return nomClient;
    }

    public void setNomClient(String nomClient) {
        this.nomClient = nomClient;
    }

    // Getter et Setter pour prenomClient
    public String getPrenomClient() {
        return prenomClient;
    }

    public void setPrenomClient(String prenomClient) {
        this.prenomClient = prenomClient;
    }

    // Getter et Setter pour adresseClient
    public String getAdresseClient() {
        return adresseClient;
    }

    public void setAdresseClient(String adresseClient) {
        this.adresseClient = adresseClient;
    }

    // Getter et Setter pour codePostal
    public String getCodePostal() {
        return codePostal;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    // Getter et Setter pour telephone
    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    // Getter et Setter pour email
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // Getter et Setter pour notes
    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    // Getter et Setter pour statutCommande
    public StatutCommande getStatutCommande() {
        return statutCommande;
    }

    public void setStatutCommande(StatutCommande statutCommande) {
        this.statutCommande = statutCommande;
    }

    // Getter et Setter pour statutPaiement
    public StatutPaiement getStatutPaiement() {
        return statutPaiement;
    }

    public void setStatutPaiement(StatutPaiement statutPaiement) {
        this.statutPaiement = statutPaiement;
    }

    // Getter et Setter pour totalCommande
    public Double getTotalCommande() {
        return totalCommande;
    }

    public void setTotalCommande(Double totalCommande) {
        this.totalCommande = totalCommande;
    }

    // Méthode toString()
    @Override
    public String toString() {
        return "Commande{" +
                "id=" + id +
                ", nomClient='" + nomClient + '\'' +
                ", adresseClient='" + adresseClient + '\'' +
                ", statutPaiement=" + statutPaiement +
                ", statutCommande=" + statutCommande +
                ", totalCommande=" + totalCommande +
                '}';
    }
}
