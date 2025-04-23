package tn.esprit.profile_service.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.profile_service.Dto.ProfileMapper;
import tn.esprit.profile_service.Dto.ProfileResponse;
import tn.esprit.profile_service.Dto.ProfileResquest;
import tn.esprit.profile_service.Exception.OperationNotPermitedException;
import tn.esprit.profile_service.entity.Profile;
import tn.esprit.profile_service.file.FileStorageService;
import tn.esprit.profile_service.repository.ProfileRepository;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProfileServiceImpl implements ProfileService{
    ProfileRepository repository;
    ProfileMapper profileMapper;
    FileStorageService fileStorageService;
    EmailService emailService;
    SmsService smsService;
    ExcelService excelService;
    @Override
    public ProfileResponse addProfile(ProfileResquest request,String userId) {
       Optional<Profile> profile = repository.findProfileByUserId(userId);
        if(profile.isPresent()){
            throw new OperationNotPermitedException("you can not add profile with same id");
        }
       Profile profile1 = Profile
               .builder()
               .userId(userId)
               .address(request.address())
               .phoneNumber(request.phoneNumber())
               .bio(request.bio())
               .picture("")
               .birthDate(request.birthDate())
               .gender(request.gender())
               .build();
       Profile profile2 = repository.save(profile1);
       emailService.sendProfileModificationEmail("benslimen.louay@esprit.tn","louay ben slimen");

        return ProfileMapper.toProfileResponse(profile2);
    }

    @Override
    public ProfileResponse updateProfile(ProfileResquest request, String userId) {
        Profile profile = repository.findProfileByUserId(userId)
                .orElseThrow( () -> new EntityNotFoundException("No Profile found with the id: " + userId));
        Profile profile1 = Profile
                .builder()
                .id(profile.getId())
                .userId(userId)
                .address(request.address())
                .phoneNumber(request.phoneNumber())
                .bio(request.bio())
                .picture(profile.getPicture())
                .birthDate(request.birthDate())
                .gender(request.gender())
                .build();
        Profile profile2 = repository.save(profile1);
        return ProfileMapper.toProfileResponse(profile2);
    }

    @Override
    public boolean deleteProfile(String userId) {
        Optional<Profile> profile = repository.findProfileByUserId(userId);
        if (profile.isPresent()){
            repository.delete(profile.get());
            smsService.sendSms("+21656628040","votre profile a été supprimer ");
            return true;
        }
        return false;
    }

    @Override
    public ProfileResponse getProfileByIdUser(String userId) {
          Profile profile = repository.findProfileByUserId(userId)
                  .orElseThrow( () -> new EntityNotFoundException("No Profile found with the id: " + userId));

        return ProfileMapper.toProfileResponse(profile);
    }

    @Override
    public List<ProfileResponse> getAllProfile() throws IOException {
        List<Profile> profiles = repository.findAll();
        excelService.generateExcelHistory(profiles,"/app/exports/profile.xlsx");
        return profiles.stream()
                .map(ProfileMapper::toProfileResponse)
                .toList()
                ;
    }

    @Override
    public void uploadProfilePicture(MultipartFile file, String userId) {
        Profile profile = repository.findProfileByUserId(userId)
                .orElseThrow( () -> new EntityNotFoundException("No Profile found with the id: " + userId));
        var profilePicture = fileStorageService.saveFile(file,userId);
        profile.setPicture(profilePicture);
       repository.save(profile);
    }


}
