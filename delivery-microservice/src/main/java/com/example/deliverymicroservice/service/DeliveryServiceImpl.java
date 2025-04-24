package com.example.deliverymicroservice.service;

import com.example.deliverymicroservice.entities.Delivery;
import com.example.deliverymicroservice.entities.DeliveryStatus;
import com.example.deliverymicroservice.repositories.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl implements IDeliveryService{
    private final DeliveryRepository deliveryRepository;

    @Override
    public Delivery createDelivery(Delivery delivery) {
        return deliveryRepository.save(delivery);
    }

    @Override
    public Optional<Delivery> getDeliveryById(Long id) {
        return deliveryRepository.findById(id);
    }

    @Override
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    @Override
    public List<Delivery> getDeliveriesByStatus(DeliveryStatus status) {
        return deliveryRepository.findByStatus(status);
    }

    @Override
    public List<Delivery> getDeliveriesByDeliveryPerson(Long deliveryPersonId) {
        return deliveryRepository.findByDeliveryPersonId(deliveryPersonId);
    }

    @Override
    public Delivery updateDeliveryStatus(Long id, DeliveryStatus status) {
        Optional<Delivery> optionalDelivery = deliveryRepository.findById(id);
        if (optionalDelivery.isPresent()) {
            Delivery delivery = optionalDelivery.get();
            delivery.setStatus(status);
            return deliveryRepository.save(delivery);
        }
        throw new RuntimeException("Delivery not found with id: " + id);
    }

    @Override
    public void deleteDelivery(Long id) {
        deliveryRepository.deleteById(id);
    }

    // private final INotificationService notificationService;

    // Simulating the delivery status change
   /* public void changeDeliveryStatus(Long deliveryId, DeliveryStatus newStatus) {
        // Retrieve the delivery (for simplicity, assuming it's found)
        Delivery delivery = new Delivery(); // Fetch the delivery from DB based on deliveryId
        delivery.setStatus(newStatus);

        // Send a notification after status change
        sendStatusChangeNotification(delivery);
    }

    private void sendStatusChangeNotification(Delivery delivery) {
        Notification notification = new Notification();
        //notification.setRecipient(delivery.getDeliveryPerson().getEmail());  // Assuming email of delivery person
        notification.setSubject("Delivery Status Updated");
        notification.setMessage("Your delivery status has changed to: " + delivery.getStatus());
        notification.setType(NotificationType.EMAIL);

        notificationService.sendNotification(notification);  // Send the email
    }*/
    /*@Override
    public void autoUpdateDeliveryStatus(Long deliveryId) {
        Optional<Delivery> optionalDelivery = deliveryRepository.findById(deliveryId);
        if (optionalDelivery.isPresent()) {
            Delivery delivery = optionalDelivery.get();

            // Case 1: Has a delivery person and is still pending
            if (delivery.getDeliveryPerson() != null && delivery.getStatus() == DeliveryStatus.PENDING) {
                delivery.setStatus(DeliveryStatus.IN_PROGRESS);
            }

            // Case 2: Time has passed, mark as delivered
            if (delivery.getActualDeliveryTime() != null &&
                    delivery.getActualDeliveryTime().isBefore(java.time.LocalDateTime.now()) &&
                    delivery.getStatus() != DeliveryStatus.DELIVERED) {
                delivery.setStatus(DeliveryStatus.DELIVERED);
            }

            deliveryRepository.save(delivery);
        } else {
            throw new RuntimeException("Delivery not found with id: " + deliveryId);
        }
    }*/
    @Override
    public void autoUpdateDeliveryStatus(Long deliveryId) {
        Optional<Delivery> optionalDelivery = deliveryRepository.findById(deliveryId);
        if (optionalDelivery.isPresent()) {
            Delivery delivery = optionalDelivery.get();
            LocalDateTime now = LocalDateTime.now();

            System.out.println("Current status: " + delivery.getStatus());
            System.out.println("Actual delivery time: " + delivery.getActualDeliveryTime());
            System.out.println("Now: " + now);

            // Case 1: Has a delivery person and is still pending
            if (delivery.getDeliveryPerson() != null && delivery.getStatus() == DeliveryStatus.PENDING) {
                delivery.setStatus(DeliveryStatus.IN_PROGRESS);
                System.out.println("Status updated to IN_PROGRESS");
            }

            // Case 2: Time has passed, mark as delivered
            if (delivery.getActualDeliveryTime() != null &&
                    delivery.getActualDeliveryTime().isBefore(now) &&
                    delivery.getStatus() != DeliveryStatus.DELIVERED) {
                delivery.setStatus(DeliveryStatus.DELIVERED);
                System.out.println("Status updated to DELIVERED");
            }

            deliveryRepository.save(delivery);
        } else {
            throw new RuntimeException("Delivery not found with id: " + deliveryId);
        }
    }


}
