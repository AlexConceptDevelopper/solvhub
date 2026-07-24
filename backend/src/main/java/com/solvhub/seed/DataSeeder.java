package com.solvhub.seed;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.solvhub.model.*;
import com.solvhub.repository.global.*;

import tools.jackson.databind.ObjectMapper;

@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final SolutionRepository solutionRepository;
    private final VoteRepository voteRepository;
    private final SolutionStatsRepository solutionStatsRepository; // <-- Ton repository de stats

    private final ObjectMapper mapper = new ObjectMapper();
    private final Random random = new Random();

    public DataSeeder(
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            ProblemRepository problemRepository,
            SolutionRepository solutionRepository,
            VoteRepository voteRepository,
            SolutionStatsRepository solutionStatsRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.solutionRepository = solutionRepository;
        this.voteRepository = voteRepository;
        this.solutionStatsRepository = solutionStatsRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedCategories();
        seedUsers();
        seedProblems();
        seedSolutions();
        seedVotes();
        seedSolutionStats(); // <-- Actif et prêt
    }

    private void seedCategories() throws Exception {
        if (categoryRepository.count() > 0)
            return;

        List<Map<String, String>> data = readJson("seed/categories.json");

        for (Map<String, String> entry : data) {
            Category category = new Category();
            category.setName(entry.get("name"));
            category.setIcon(entry.get("icon"));
            categoryRepository.save(category);
        }

        System.out.println("✅ Catégories seedées : " + data.size());
    }

    private void seedUsers() throws Exception {
        if (userRepository.count() > 0)
            return;

        List<Map<String, Object>> data = readJson("seed/users.json");

        for (Map<String, Object> entry : data) {
            User user = new User();
            user.setUsername((String) entry.get("username"));
            user.setEmail((String) entry.get("email"));
            user.setPasswordHash((String) entry.get("passwordHash"));
            user.setChecked((Boolean) entry.get("checked"));
            user.setRole((String) entry.get("role"));
            user.setBadge((String) entry.get("badge"));
            userRepository.save(user);
        }

        System.out.println("✅ Utilisateurs seedés : " + data.size());
    }

    private void seedProblems() throws Exception {
        if (problemRepository.count() > 0)
            return;

        List<Map<String, String>> data = readJson("seed/problems.json");
        List<User> users = userRepository.findAll();

        for (Map<String, String> entry : data) {
            Category category = categoryRepository.findAll().stream()
                    .filter(c -> c.getName().equals(entry.get("category")))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException(
                            "Catégorie introuvable : " + entry.get("category")));

            Problem problem = new Problem();
            problem.setTitle(entry.get("title"));
            problem.setDescription(entry.get("description"));
            problem.setCategory(category);
            problem.setUser(users.get(random.nextInt(users.size())));
            problemRepository.save(problem);
        }

        System.out.println("✅ Problèmes seedés : " + data.size());
    }

    private void seedSolutions() throws Exception {
        if (solutionRepository.count() > 0)
            return;

        List<Map<String, Object>> data = readJson("seed/solutions.json");
        List<Problem> problems = problemRepository.findAll();
        List<User> users = userRepository.findAll();

        for (Map<String, Object> entry : data) {
            String problemTitle = (String) entry.get("problemTitle");

            Problem problem = problems.stream()
                    .filter(p -> p.getTitle().equals(problemTitle))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException(
                            "Problème introuvable : " + problemTitle));

            Solution solution = new Solution();
            solution.setTitle((String) entry.get("title"));
            solution.setSteps((String) entry.get("steps"));
            solution.setDifficulty((Integer) entry.get("difficulty"));
            solution.setTimeMinutes((Integer) entry.get("timeMinutes"));
            solution.setRiskLevel((Integer) entry.get("riskLevel"));
            solution.setProblem(problem);
            solution.setUser(users.get(random.nextInt(users.size())));
            solutionRepository.save(solution);
        }

        System.out.println("✅ Solutions seedées : " + data.size());
    }

    private void seedVotes() {
        if (voteRepository.count() > 0)
            return;

        List<Solution> solutions = solutionRepository.findAll();
        List<User> users = userRepository.findAll();
        String[] statuses = { "SUCCESS", "SUCCESS", "SUCCESS", "PARTIAL", "FAILURE" };

        int totalVotes = 0;

        for (Solution solution : solutions) {
            List<User> shuffledUsers = new java.util.ArrayList<>(users);
            java.util.Collections.shuffle(shuffledUsers, random);

            int maxPossible = shuffledUsers.size();
            int voteCount = Math.min(maxPossible, 5 + random.nextInt(36));

            for (int i = 0; i < voteCount; i++) {
                Vote vote = new Vote();
                vote.setSolution(solution);
                vote.setUser(shuffledUsers.get(i));
                vote.setStatus(statuses[random.nextInt(statuses.length)]);
                voteRepository.save(vote);
                totalVotes++;
            }
        }

        System.out.println("✅ Votes seedés : " + totalVotes);
    }

    private void seedSolutionStats() throws Exception {
        if (solutionStatsRepository.count() > 0)
            return;

        List<Map<String, Object>> data = readJson("seed/solutions_stats.json");

        for (Map<String, Object> entry : data) {
            Integer solutionId = ((Number) entry.get("solutionId")).intValue();
            Integer likes = ((Number) entry.get("likes")).intValue(); 

            Solution solution = solutionRepository.findById(solutionId).orElse(null);

            if (solution != null) {
                SolutionStats stats = new SolutionStats();
                stats.setSolution(solution);
                stats.setSuccessCount(likes); 
                stats.setPartialCount(random.nextInt(10));
                stats.setFailureCount(random.nextInt(5));
                solutionStatsRepository.save(stats);
            }
        }

        System.out.println("✅ Stats des solutions seedées : " + data.size());
    }

    private <T> List<T> readJson(String path) throws Exception {
        InputStream is = new ClassPathResource(path).getInputStream();
        return mapper.readValue(is, mapper.getTypeFactory()
                .constructCollectionType(List.class, Object.class));
    }
}