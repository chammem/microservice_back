package com.example.deliverymicroservice.service;

import com.example.deliverymicroservice.entities.Delivery;
import com.example.deliverymicroservice.entities.DeliveryStatus;

import java.util.List;
import java.util.Optional;

public interface IDeliveryService {
    Delivery createDelivery(Delivery delivery);

    Optional<Delivery> getDeliveryById(Long id);

    List<Delivery> getAllDeliveries();

    List<Delivery> getDeliveriesByStatus(DeliveryStatus status);

    List<Delivery> getDeliveriesByDeliveryPerson(Long deliveryPersonId);

    Delivery updateDeliveryStatus(Long id, DeliveryStatus status);

    void deleteDelivery(Long id);
    void autoUpdateDeliveryStatus(Long deliveryId);

}
