package com.esprit.microservice.microproject.Service;

import com.esprit.microservice.microproject.Entity.Restaurant;
import com.esprit.microservice.microproject.Repository.RestaurantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RestaurantService {

    private static final Logger logger = LoggerFactory.getLogger(RestaurantService.class);

    @Autowired
    private RestaurantRepository restaurantRepository;

    // Create
    public Restaurant createRestaurant(Restaurant restaurant) {
        logger.info("Creating a new restaurant: {}", restaurant.getName());
        restaurant.setCreatedAt(LocalDateTime.now());
        restaurant.setUpdatedAt(LocalDateTime.now());
        return restaurantRepository.save(restaurant); // Pas besoin de cast
    }

    // Read (All)
    public List<Restaurant> getAllRestaurants() {
        logger.info("Fetching all restaurants");
        return restaurantRepository.findAll();
    }

    // Read (ById)
    public Restaurant getRestaurantById(Long id) {
        logger.info("Fetching restaurant with id: {}", id);
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Restaurant not found with id: " + id
                ));
    }

    // Update
    public Restaurant updateRestaurant(Long id, Restaurant updatedRestaurant) {
        return restaurantRepository.findById(id)
                .map(restaurant -> {
                    restaurant.setName(updatedRestaurant.getName());
                    restaurant.setAddress(updatedRestaurant.getAddress());
                    restaurant.setPhone(updatedRestaurant.getPhone());
                    restaurant.setEmail(updatedRestaurant.getEmail());
                    restaurant.setOpeningHours(updatedRestaurant.getOpeningHours());
                    restaurant.setAvailable(updatedRestaurant.isAvailable());
                    restaurant.setDescription(updatedRestaurant.getDescription());
                    restaurant.setRating(updatedRestaurant.getRating());
                    restaurant.setImageUrl(updatedRestaurant.getImageUrl());
                    restaurant.setUpdatedAt(LocalDateTime.now());
                    return restaurantRepository.save(restaurant);
                })
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Restaurant not found with id: " + id
                ));
    }

    // Delete
    public void deleteRestaurant(Long id) {
        logger.info("Deleting restaurant with id: {}", id);
        restaurantRepository.deleteById(id);
    }
    public List<Restaurant> getOpenRestaurants() {
        return restaurantRepository.findByIsAvailableTrue();
    }
    public List<Restaurant> filterByRating(double min) {
        return restaurantRepository.findByRatingGreaterThanEqual(min);
    }
}

