package thanhanh.job_recruitment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import thanhanh.job_recruitment.dto.response.Resume.AIMatchResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAIService {

    @Value("${gemini.api-key:}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiAIService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public AIMatchResponse evaluateResumeMatch(String cvText, String jobDescription) {
        if (apiKey == null || apiKey.isEmpty()) {
            return new AIMatchResponse(0, "AI Matching is disabled: Gemini API Key is missing.");
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        String prompt = "You are an expert HR Technical Recruiter. Please evaluate the following CV against the given Job Description.\n" +
                "Job Description:\n" + jobDescription + "\n\n" +
                "CV Text:\n" + cvText + "\n\n" +
                "Give a compatibility score from 0 to 100 based on how well the candidate's skills and experience match the job requirements. " +
                "Also provide a short reasoning for the score (max 2-3 sentences). " +
                "Output your response strictly as a JSON object with two fields: 'score' (an integer) and 'reasoning' (a string). Do not output any markdown formatting like ```json.";

        try {
            Map<String, Object> requestBody = new HashMap<>();
            
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
            
            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));
            
            requestBody.put("contents", List.of(content));

            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("responseMimeType", "application/json");
            requestBody.put("generationConfig", generationConfig);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            String responseString = restTemplate.postForObject(url, request, String.class);

            JsonNode root = objectMapper.readTree(responseString);
            String aiJsonText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

            JsonNode aiJson = objectMapper.readTree(aiJsonText);
            int score = aiJson.path("score").asInt();
            String reasoning = aiJson.path("reasoning").asText();

            return new AIMatchResponse(score, reasoning);
        } catch (Exception e) {
            e.printStackTrace();
            return new AIMatchResponse(0, "Error evaluating CV with AI: " + e.getMessage());
        }
    }
}
