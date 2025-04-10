package com.esprit.microservice.microproject.Controller;

import com.esprit.microservice.microproject.Entity.Restaurant;
import com.esprit.microservice.microproject.Service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    // ✅ Create
    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.createRestaurant(restaurant));
    }

    // ✅ Read all
    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    // ✅ Read by ID
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    // ✅ Update
    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable Long id, @RequestBody Restaurant updatedRestaurant) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, updatedRestaurant));
    }

    // ✅ Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Get open restaurants
    @GetMapping("/open-now")
    public ResponseEntity<List<Restaurant>> getOpenRestaurants() {
        return ResponseEntity.ok(restaurantService.getOpenRestaurants());
    }

    // ✅ Filter by rating
    @GetMapping("/filter-by-rating")
    public ResponseEntity<List<Restaurant>> filterByRating(@RequestParam double min) {
        return ResponseEntity.ok(restaurantService.filterByRating(min));
    }
}
