package com.example.deliverymicroservice.entities;

import lombok.Data;

@Data
public class Notification {
    private String recipient;
    private String subject;
    private String message;
    private NotificationType type;  // Email, SMS, etc.
}