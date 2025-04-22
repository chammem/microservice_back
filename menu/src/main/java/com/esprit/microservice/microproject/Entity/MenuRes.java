package com.esprit.microservice.microproject.Entity;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "menus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuRes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // e.g., Salé, Sucré, Boisson

    private String description;
    private double price;
    private boolean isAvailable;
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "menu_ingredients", joinColumns = @JoinColumn(name = "menu_id"))
    @Column(name = "ingredient")
    private List<String> ingredients; // List of ingredients for the menu item

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();

    }
}
