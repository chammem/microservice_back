package com.example.deliverymicroservice.service;


import com.example.deliverymicroservice.entities.DeliveryPerson;
import com.example.deliverymicroservice.repositories.DeliveryPersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

@RequiredArgsConstructor
public class DeliveryPersonServiceImpl implements IDeliveryPersonService {
    private final DeliveryPersonRepository deliveryPersonRepository;
    // private final INotificationService notificationService;
    @Override
    public DeliveryPerson createDeliveryPerson(DeliveryPerson deliveryPerson) {
        return deliveryPersonRepository.save(deliveryPerson);
    }

    @Override
    public Optional<DeliveryPerson> getDeliveryPersonById(Long id) {
        return deliveryPersonRepository.findById(id);
    }

    @Override
    public Optional<DeliveryPerson> getDeliveryPersonByPhone(String phone) {
        return deliveryPersonRepository.findByPhone(phone);
    }

    @Override
    public List<DeliveryPerson> getAllDeliveryPersons() {
        return deliveryPersonRepository.findAll();
    }

    @Override
    public DeliveryPerson updateDeliveryPersonAvailability(Long id, Boolean isAvailable) {
        Optional<DeliveryPerson> optionalDeliveryPerson = deliveryPersonRepository.findById(id);
        if (optionalDeliveryPerson.isPresent()) {
            DeliveryPerson deliveryPerson = optionalDeliveryPerson.get();
            deliveryPerson.setAvailable(isAvailable);
            return deliveryPersonRepository.save(deliveryPerson);
        }
        throw new RuntimeException("Delivery Person not found with id: " + id);
    }

    @Override
    public void deleteDeliveryPerson(Long id) {
        deliveryPersonRepository.deleteById(id);
    }


}