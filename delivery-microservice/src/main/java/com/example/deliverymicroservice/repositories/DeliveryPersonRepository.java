package com.example.deliverymicroservice.repositories;

import com.example.deliverymicroservice.entities.DeliveryPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryPersonRepository extends JpaRepository<DeliveryPerson,Long> {
    Optional<DeliveryPerson> findByPhone(String phone);
}