package com.example.deliverymicroservice.repositories;

import com.example.deliverymicroservice.entities.Delivery;
import com.example.deliverymicroservice.entities.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery,Long> {
    List<Delivery> findByStatus(DeliveryStatus status);

    List<Delivery> findByDeliveryPersonId(Long deliveryPersonId);
}