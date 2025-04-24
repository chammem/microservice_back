package com.example.deliverymicroservice.service;

import com.example.deliverymicroservice.entities.DeliveryPerson;

import java.util.List;
import java.util.Optional;

public interface IDeliveryPersonService {

    DeliveryPerson createDeliveryPerson(DeliveryPerson deliveryPerson);

    Optional<DeliveryPerson> getDeliveryPersonById(Long id);

    Optional<DeliveryPerson> getDeliveryPersonByPhone(String phone);

    List<DeliveryPerson> getAllDeliveryPersons();

    DeliveryPerson updateDeliveryPersonAvailability(Long id, Boolean isAvailable);

    void deleteDeliveryPerson(Long id);
}

