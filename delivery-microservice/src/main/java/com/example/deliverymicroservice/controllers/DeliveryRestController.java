package com.example.deliverymicroservice.controllers;


import com.example.deliverymicroservice.entities.Delivery;
import com.example.deliverymicroservice.entities.DeliveryPerson;
import com.example.deliverymicroservice.entities.DeliveryStatus;
import com.example.deliverymicroservice.service.IDeliveryPersonService;
import com.example.deliverymicroservice.service.IDeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class DeliveryRestController {
    private final IDeliveryService deliveryService;
    private final IDeliveryPersonService deliveryPersonService;

    // =======================
    //  Gestion des Livraisons
    // =======================

    @PostMapping("/deliveries")
    public ResponseEntity<Delivery> createDelivery(@RequestBody Delivery delivery) {
        return ResponseEntity.ok(deliveryService.createDelivery(delivery));
    }



    @GetMapping("/deliveries/{id}")
    public ResponseEntity<Delivery> getDeliveryById(@PathVariable Long id) {
        return deliveryService.getDeliveryById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/deliveries")
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    @GetMapping("/deliveries/status/{status}")
    public ResponseEntity<List<Delivery>> getDeliveriesByStatus(@PathVariable DeliveryStatus status) {
        return ResponseEntity.ok(deliveryService.getDeliveriesByStatus(status));
    }

    @GetMapping("/deliveries/person/{personId}")
    public ResponseEntity<List<Delivery>> getDeliveriesByDeliveryPerson(@PathVariable Long personId) {
        return ResponseEntity.ok(deliveryService.getDeliveriesByDeliveryPerson(personId));
    }

    @PutMapping("/deliveries/{id}/status")
    public ResponseEntity<Delivery> updateDeliveryStatus(@PathVariable Long id, @RequestParam DeliveryStatus status) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(id, status));
    }

    @DeleteMapping("/deliveries/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id) {
        deliveryService.deleteDelivery(id);
        return ResponseEntity.noContent().build();
    }

    // =======================
    //  Gestion des Livreurs
    // =======================

    @PostMapping("/delivery-persons")
    public ResponseEntity<DeliveryPerson> createDeliveryPerson(@RequestBody DeliveryPerson deliveryPerson) {
        System.out.println("Received: " + deliveryPerson); // Add this line
        return ResponseEntity.ok(deliveryPersonService.createDeliveryPerson(deliveryPerson));
    }


    @GetMapping("/delivery-persons/{id}")
    public ResponseEntity<DeliveryPerson> getDeliveryPersonById(@PathVariable Long id) {
        return deliveryPersonService.getDeliveryPersonById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/delivery-persons/phone/{phone}")
    public ResponseEntity<DeliveryPerson> getDeliveryPersonByPhone(@PathVariable String phone) {
        return deliveryPersonService.getDeliveryPersonByPhone(phone)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/delivery-persons")
    public ResponseEntity<List<DeliveryPerson>> getAllDeliveryPersons() {
        return ResponseEntity.ok(deliveryPersonService.getAllDeliveryPersons());
    }

    @PutMapping("/delivery-persons/{id}/availability")
    public ResponseEntity<DeliveryPerson> updateDeliveryPersonAvailability(
            @PathVariable Long id, @RequestParam Boolean isAvailable) {
        return ResponseEntity.ok(deliveryPersonService.updateDeliveryPersonAvailability(id, isAvailable));
    }

    @DeleteMapping("/delivery-persons/{id}")
    public ResponseEntity<Void> deleteDeliveryPerson(@PathVariable Long id) {
        deliveryPersonService.deleteDeliveryPerson(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/test")
    public String test() {
        return "Delivery service is alive!";
    }


    /// metier

    @PutMapping("/{id}/auto-update-status")
    public ResponseEntity<Delivery> autoUpdateStatus(@PathVariable Long id) {
        deliveryService.autoUpdateDeliveryStatus(id);
        return ResponseEntity.ok().build();
    }


}
