package com.esprit.microservice.microproject.Service;

import com.esprit.microservice.microproject.Entity.MenuRes;
import com.esprit.microservice.microproject.Repository.MenuResRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;

import java.util.List;
@Service
@RequiredArgsConstructor
public class MenuResService {
    @Autowired
    private MenuResRepository menuRepository;

    public MenuRes createMenu(MenuRes menu) {
        return menuRepository.save(menu);
    }

    public List<MenuRes> getAllMenus() {
        return menuRepository.findAll();
    }

    public MenuRes getMenuById(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Menu with id " + id + " not found"));
    }

    public List<MenuRes> getMenusByCategory(String category) {
        return menuRepository.findByCategory(category);
    }

    public MenuRes updateMenu(Long id, MenuRes menu) {
        MenuRes existingMenu = getMenuById(id);
        existingMenu.setName(menu.getName());
        existingMenu.setCategory(menu.getCategory());
        existingMenu.setDescription(menu.getDescription());
        existingMenu.setPrice(menu.getPrice());
        existingMenu.setAvailable(menu.isAvailable());
        existingMenu.setImageUrl(menu.getImageUrl());
        existingMenu.setIngredients(menu.getIngredients());
        return menuRepository.save(existingMenu);
    }

    public void deleteMenu(Long id) {
        MenuRes menu = getMenuById(id);
        menuRepository.delete(menu);
    }


}
