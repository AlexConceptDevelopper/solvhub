package com.solvhub.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.solvhub.service.SitemapService;

@RestController
public class SitemapController {

    private final SitemapService sitemapService;

    public SitemapController(SitemapService sitemapService) {
        this.sitemapService = sitemapService;
    }

    @GetMapping(
            value = "/sitemap.xml",
            produces = MediaType.APPLICATION_XML_VALUE
    )
    public ResponseEntity<String> getSitemap() {

        String sitemap = sitemapService.generateSitemap();

        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_XML)
                .body(sitemap);
    }
}