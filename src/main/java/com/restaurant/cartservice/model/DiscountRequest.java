package com.restaurant.cartservice.model;

import lombok.Data;

@Data
public class DiscountRequest {
    public String getDiscountCode() {
        return discountCode;
    }

    public void setDiscountCode(String discountCode) {
        this.discountCode = discountCode;
    }

    private String discountCode;
}