package com.esprit.microservice.microproject.Repository;

import com.esprit.microservice.microproject.Entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    // Trouver les restaurants disponibles (API /restaurants/open-now)
    List<Restaurant> findByIsAvailableTrue();

    // Trouver les restaurants avec un rating supérieur ou égal à la note donnée
    List<Restaurant> findByRatingGreaterThanEqual(double rating);
}
