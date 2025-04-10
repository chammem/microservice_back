// src/main/java/com/restaurant/cartservice/controller/CartController.java
package com.restaurant.cartservice.controller;

import com.restaurant.cartservice.model.Cart;
import com.restaurant.cartservice.model.CartItem;
import com.restaurant.cartservice.model.DiscountRequest;
import com.restaurant.cartservice.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    @Autowired
    private CartService cartService;

    //  http://localhost:8081/api/cart/user123
    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable String userId) {
        return cartService.getCartByUserId(userId);
    }

    //  http://localhost:8081/api/cart/user123/items
    @PostMapping("/{userId}/items")
    public Cart addItem(@PathVariable String userId, @RequestBody CartItem item) {
        return cartService.addItemToCart(userId, item);
    }

    //  http://localhost:8081/api/cart/user123/items/1?quantity=3
    @PutMapping("/{userId}/items/{itemId}")
    public Cart updateItemQuantity(@PathVariable String userId, @PathVariable Long itemId, @RequestParam int quantity) {
        return cartService.updateItemQuantity(userId, itemId, quantity);
    }

    //  http://localhost:8081/api/cart/user123/items/1
    @DeleteMapping("/{userId}/items/{itemId}")
    public Cart removeItem(@PathVariable String userId, @PathVariable Long itemId) {
        return cartService.removeItemFromCart(userId, itemId);
    }

    //  http://localhost:8081/api/cart/user123/total
    @GetMapping("/{userId}/total")
    public double getTotal(@PathVariable String userId) {
        return cartService.calculateTotal(userId);
    }

    //  http://localhost:8081/api/cart/user123/item-count
    @GetMapping("/{userId}/item-count")
    public int getItemCount(@PathVariable String userId) {
        return cartService.getItemCount(userId);
    }

    //  http://localhost:8081/api/cart/user123/discount
    @PostMapping("/{userId}/discount")
    public double applyDiscount(@PathVariable String userId, @RequestBody DiscountRequest discountRequest) {
        return cartService.applyDiscount(userId, discountRequest.getDiscountCode());
    }
}