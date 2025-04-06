// src/main/java/com/restaurant/cartservice/service/CartService.java
package com.restaurant.cartservice.service;

import com.restaurant.cartservice.model.Cart;
import com.restaurant.cartservice.model.CartItem;
import com.restaurant.cartservice.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public Cart getCartByUserId(String userId) {
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            cart = new Cart();
            cart.setUserId(userId);
            cart = cartRepository.save(cart);
        }
        return cart;
    }

    public Cart addItemToCart(String userId, CartItem item) {
        Cart cart = getCartByUserId(userId);
        item.setCart(cart);
        cart.getItems().add(item);
        return cartRepository.save(cart);
    }

    public Cart updateItemQuantity(String userId, Long itemId, int quantity) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .ifPresent(item -> item.setQuantity(quantity));
        return cartRepository.save(cart);
    }

    public Cart removeItemFromCart(String userId, Long itemId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(item -> item.getId().equals(itemId));
        return cartRepository.save(cart);
    }

    public double calculateTotal(String userId) {
        Cart cart = getCartByUserId(userId);
        return cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
}