package tn.esprit.employesmicro.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.employesmicro.repository.EmployeeRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    LocalDate date;

    LocalTime startTime;
    LocalTime endTime;

    String description;

    @ManyToMany
    @JsonIgnore
    Set<Employee> employees;

}
