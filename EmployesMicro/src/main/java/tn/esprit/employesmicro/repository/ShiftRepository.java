package tn.esprit.employesmicro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.employesmicro.entity.Shift;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {

}
