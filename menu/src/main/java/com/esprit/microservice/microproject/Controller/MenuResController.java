package com.esprit.microservice.microproject.Controller;

import com.esprit.microservice.microproject.Entity.MenuRes;
import com.esprit.microservice.microproject.Service.MenuResService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/menus")
@RequiredArgsConstructor

public class MenuResController {
    private final MenuResService menuService;

    @GetMapping
    public ResponseEntity<List<MenuRes>> getAllMenus() {
        return ResponseEntity.ok(menuService.getAllMenus());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MenuRes>> getMenusByCategory(@PathVariable String category) {
        return ResponseEntity.ok(menuService.getMenusByCategory(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuRes> getMenuById(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuById(id));
    }

    @PostMapping
    public ResponseEntity<MenuRes> createMenu(@RequestBody MenuRes menu) {
        return ResponseEntity.ok(menuService.createMenu(menu));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuRes> updateMenu(@PathVariable Long id, @RequestBody MenuRes menu) {
        return ResponseEntity.ok(menuService.updateMenu(id, menu));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return ResponseEntity.noContent().build();
    }



}
