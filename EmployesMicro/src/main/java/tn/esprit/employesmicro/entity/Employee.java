package tn.esprit.employesmicro.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
 // Explicit table name
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String nom;

    String poste;

    String email;

    String telephone;

    LocalDate dateEmbauche;

    // Instead of mapping the Restaurant entity directly, we store the restaurant's ID.
    Long restaurantId;

    @ManyToMany(mappedBy = "employees", cascade = CascadeType.ALL)
    @JsonIgnore
    Set<Shift>shifts;
}
