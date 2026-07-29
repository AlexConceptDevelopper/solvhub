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
        // Envoi du fichier vers Cloudinary
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String secureUrl = (String) uploadResult.get("secure_url");

        // Création et sauvegarde du média lié à la solution
        SolutionMedia media = new SolutionMedia();
        media.setUrl(secureUrl);
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
}
