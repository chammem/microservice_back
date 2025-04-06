package tn.esprit.microservice.commande.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.microservice.commande.entities.Commande;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
}
