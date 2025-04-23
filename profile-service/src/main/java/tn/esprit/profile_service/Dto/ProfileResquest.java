package tn.esprit.profile_service.Dto;

import jakarta.validation.constraints.*;
import tn.esprit.profile_service.entity.Gender;

import java.time.LocalDate;

public record ProfileResquest(


    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Pattern(regexp = "\\+?[0-9]{8,15}", message = "Numéro de téléphone invalide")
    String phoneNumber,

    @NotBlank(message = "L'adresse est obligatoire")
    @Size(min = 5, max = 255, message = "L'adresse doit contenir entre 5 et 255 caractères")
    String address,

    @NotNull(message = "La date de naissance est obligatoire")
    @Past(message = "La date de naissance doit être dans le passé")
     LocalDate birthDate,

    @NotNull(message = "Le genre est obligatoire")
    Gender gender,

    @Size(max = 500, message = "La biographie ne doit pas dépasser 500 caractères")
    String bio




) {
}
