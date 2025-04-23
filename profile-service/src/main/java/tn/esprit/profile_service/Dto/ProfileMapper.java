package tn.esprit.profile_service.Dto;

import org.springframework.stereotype.Service;
import tn.esprit.profile_service.entity.Profile;
import tn.esprit.profile_service.file.FileUtils;

@Service
public class ProfileMapper {


  public static ProfileResponse toProfileResponse(Profile profile){
      return ProfileResponse
              .builder()
              .id(profile.getId())
              .userId(profile.getUserId())
              .gender(profile.getGender())
              .birthDate(profile.getBirthDate())
              .phoneNumber(profile.getPhoneNumber())
              .address(profile.getAddress())
              .bio(profile.getBio())
              // TODO render picture bytes
              .picture(FileUtils.readFileFromLocation(profile.getPicture()))
              .build();
  }
}
