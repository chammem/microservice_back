// src/main/java/com/restaurant/cartservice/controller/CartController.java
package com.restaurant.cartservice.controller;

import com.restaurant.cartservice.model.Cart;
import com.restaurant.cartservice.model.CartItem;
import com.restaurant.cartservice.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable String userId) {
        return cartService.getCartByUserId(userId);
    }

    @PostMapping("/{userId}/items")
    public Cart addItem(@PathVariable String userId, @RequestBody CartItem item) {
        return cartService.addItemToCart(userId, item);
    }

    @PutMapping("/{userId}/items/{itemId}")
    public Cart updateItemQuantity(@PathVariable String userId, @PathVariable Long itemId, @RequestParam int quantity) {
        return cartService.updateItemQuantity(userId, itemId, quantity);
    }

    @DeleteMapping("/{userId}/items/{itemId}")
    public Cart removeItem(@PathVariable String userId, @PathVariable Long itemId) {
        return cartService.removeItemFromCart(userId, itemId);
    }

    @GetMapping("/{userId}/total")
    public double getTotal(@PathVariable String userId) {
        return cartService.calculateTotal(userId);
    }
}