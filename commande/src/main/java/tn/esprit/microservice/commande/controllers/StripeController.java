package tn.esprit.microservice.commande.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.microservice.commande.entities.PaymentRequest;
import tn.esprit.microservice.commande.services.StripeService;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*") // pour Angular
public class StripeController {

    @Autowired
    private StripeService stripeService;

    @PostMapping("/create-checkout-session")
    public String createCheckoutSession(@RequestBody PaymentRequest request) {
        return stripeService.createCheckoutSession(
                request.getAmount(),
                request.getCurrency(),
                request.getSuccessUrl(),
                request.getCancelUrl()
        );
    }
}