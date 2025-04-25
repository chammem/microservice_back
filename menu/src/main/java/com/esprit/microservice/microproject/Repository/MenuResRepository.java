package com.esprit.microservice.microproject.Repository;

import com.esprit.microservice.microproject.Entity.MenuRes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.stereotype.Repository;


@Repository
public interface MenuResRepository extends JpaRepository<MenuRes, Long>{


        // API 1 : Lister les menus par catégorie
        List<MenuRes> findByCategory(String category);  // Utiliser String si Menu.category est un String




    }
