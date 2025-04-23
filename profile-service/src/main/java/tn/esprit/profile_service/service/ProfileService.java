package tn.esprit.profile_service.service;

import org.springframework.web.multipart.MultipartFile;
import tn.esprit.profile_service.Dto.ProfileResponse;
import tn.esprit.profile_service.Dto.ProfileResquest;

import java.io.IOException;
import java.util.List;

public interface ProfileService {
    ProfileResponse addProfile(ProfileResquest request,String userId);
    ProfileResponse updateProfile(ProfileResquest request,String userId);
    boolean deleteProfile(String userId);
    ProfileResponse getProfileByIdUser(String userId);
    List<ProfileResponse> getAllProfile() throws IOException;
    void uploadProfilePicture(MultipartFile file,String userId);

}