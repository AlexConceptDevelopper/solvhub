package com.solvhub.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.solvhub.model.Category;
import com.solvhub.model.Problem;
import com.solvhub.model.Solution;
import com.solvhub.repository.global.CategoryRepository;
import com.solvhub.repository.global.ProblemRepository;
import com.solvhub.repository.global.SolutionRepository;

@Service
public class SitemapService {

    private static final String BASE_URL = "https://www.solvhub.fr";

    private final CategoryRepository categoryRepository;
    private final ProblemRepository problemRepository;
    private final SolutionRepository solutionRepository;

    public SitemapService(
            CategoryRepository categoryRepository,
            ProblemRepository problemRepository,
            SolutionRepository solutionRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.problemRepository = problemRepository;
        this.solutionRepository = solutionRepository;
    }

    public String generateSitemap() {

        List<Category> categories = categoryRepository.findAll();
        List<Problem> problems = problemRepository.findAll();
        List<Solution> solutions = solutionRepository.findAll();

        StringBuilder sitemap = new StringBuilder();

        sitemap.append("""
                <?xml version="1.0" encoding="UTF-8"?>
                <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                """);

        // Page d'accueil
        addUrl(sitemap, BASE_URL + "/", "1.0");

        // Pages principales
        addUrl(sitemap, BASE_URL + "/problems", "0.9");
        addUrl(sitemap, BASE_URL + "/categories", "0.9");

        // Classements
        addUrl(sitemap, BASE_URL + "/ranking", "0.7");
        addUrl(sitemap, BASE_URL + "/ranking/solutions", "0.7");
        addUrl(sitemap, BASE_URL + "/ranking/contributors", "0.7");
        addUrl(sitemap, BASE_URL + "/ranking/problems", "0.7");

        // Pages légales
        addUrl(sitemap, BASE_URL + "/legal", "0.3");
        addUrl(sitemap, BASE_URL + "/cgu", "0.3");
        addUrl(sitemap, BASE_URL + "/privacy", "0.3");

        // Catégories
        for (Category category : categories) {
            if (category.getIdCategory() != null) {
                addUrl(
                        sitemap,
                        BASE_URL + "/categories/" + category.getIdCategory(),
                        "0.8"
                );
            }
        }

        // Problèmes
        for (Problem problem : problems) {
            if (problem.getIdProblem() != null) {
                addUrl(
                        sitemap,
                        BASE_URL + "/problem/" + problem.getIdProblem(),
                        "0.9"
                );
            }
        }

        // Solutions
        for (Solution solution : solutions) {
            if (solution.getIdSolution() != null) {
                addUrl(
                        sitemap,
                        BASE_URL + "/solution/" + solution.getIdSolution(),
                        "0.7"
                );
            }
        }

        sitemap.append("</urlset>");

        return sitemap.toString();
    }

    private void addUrl(
            StringBuilder sitemap,
            String url,
            String priority
    ) {
        sitemap.append("    <url>\n");
        sitemap.append("        <loc>")
                .append(escapeXml(url))
                .append("</loc>\n");
        sitemap.append("        <lastmod>")
                .append(LocalDate.now())
                .append("</lastmod>\n");
        sitemap.append("        <priority>")
                .append(priority)
                .append("</priority>\n");
        sitemap.append("    </url>\n");
    }

    private String escapeXml(String value) {
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}