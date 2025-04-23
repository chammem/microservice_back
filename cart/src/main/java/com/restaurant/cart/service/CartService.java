package com.restaurant.cart.service;

import com.restaurant.cart.model.Cart;
import com.restaurant.cart.model.CartItem;
import com.restaurant.cart.repository.CartItemRepository;
import com.restaurant.cart.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    public Cart getCartByUserId(String userId) {
        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
        if (cartOpt.isEmpty()) {
            Cart newCart = new Cart(userId);
            return cartRepository.save(newCart);
        }
        return cartOpt.get();
    }

    public Cart addItemToCart(String userId, CartItem item) {
        Cart cart = getCartByUserId(userId);
        item.setCart(cart);
        cart.getItems().add(item);
        cartItemRepository.save(item);
        return cartRepository.save(cart);
    }

    public Cart removeItemFromCart(String userId, Long itemId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(item -> item.getId().equals(itemId));
        cartItemRepository.deleteById(itemId);
        return cartRepository.save(cart);
    }

    public Cart updateItemQuantity(String userId, Long itemId, int quantity) {
        Cart cart = getCartByUserId(userId);
        Optional<CartItem> itemOpt = cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst();
        if (itemOpt.isPresent()) {
            CartItem item = itemOpt.get();
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return cartRepository.save(cart);
    }
}