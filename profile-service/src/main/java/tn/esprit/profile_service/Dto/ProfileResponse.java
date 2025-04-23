package tn.esprit.profile_service.Dto;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import tn.esprit.profile_service.entity.Gender;

import java.time.LocalDate;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileResponse {
    private Integer id;

    private String phoneNumber;
    private String address;
    private LocalDate birthDate;

    private Gender gender;
    private String bio;

    private byte[]  picture;

    private String userId;
}
