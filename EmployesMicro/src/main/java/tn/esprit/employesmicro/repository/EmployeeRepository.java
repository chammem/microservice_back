package tn.esprit.employesmicro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.employesmicro.entity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
