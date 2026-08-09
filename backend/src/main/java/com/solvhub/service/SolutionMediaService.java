package com.solvhub.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.solvhub.model.Solution;
import com.solvhub.model.SolutionMedia;
import com.solvhub.repository.global.SolutionMediaRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class SolutionMediaService {

    private final Cloudinary cloudinary;
    private final SolutionMediaRepository mediaRepository;

    public SolutionMediaService(Cloudinary cloudinary, SolutionMediaRepository mediaRepository) {
        this.cloudinary = cloudinary;
        this.mediaRepository = mediaRepository;
    }

    public SolutionMedia uploadAndSaveMedia(MultipartFile file, Solution solution) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String secureUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id"); // 🆕

        SolutionMedia media = new SolutionMedia();
        media.setUrl(secureUrl);
        media.setPublicId(publicId); // 🆕
        media.setType("IMAGE");
        media.setSolution(solution);

        return mediaRepository.save(media);
    }

    public SolutionMedia saveVideoUrl(String videoUrl, Solution solution) {
        SolutionMedia media = new SolutionMedia();
        media.setUrl(videoUrl);
        media.setType("VIDEO");
        media.setSolution(solution);

        return mediaRepository.save(media);
    }

    public void deleteMedia(SolutionMedia media) {
        if ("IMAGE".equals(media.getType()) && media.getPublicId() != null) {
            try {
                cloudinary.uploader().destroy(media.getPublicId(), ObjectUtils.emptyMap());
            } catch (IOException e) {
                // On log l'erreur mais on ne bloque pas la suppression en base pour autant
                System.err.println("Erreur lors de la suppression Cloudinary : " + e.getMessage());
            }
        }
        mediaRepository.delete(media);
    }
}
