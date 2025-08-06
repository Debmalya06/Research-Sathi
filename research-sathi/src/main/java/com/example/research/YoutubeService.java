package com.example.research;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.MediaType;
import reactor.core.publisher.Mono;

@Service
public class YoutubeService {

    private final WebClient webClient = WebClient.create("http://transcript:5001");

    public String getTranscriptFromUrl(String url) {
        String response = webClient.post()
            .uri("/api/transcript")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue("{\"url\":\"" + url + "\"}")
            .retrieve()
            .bodyToMono(String.class)
            .block();

        // Extract transcript from JSON response
        if (response != null && response.contains("\"transcript\"")) {
            int start = response.indexOf(":\"") + 2;
            int end = response.lastIndexOf("\"");
            return response.substring(start, end);
        } else if (response != null && response.contains("\"error\"")) {
            throw new RuntimeException("Transcript API error: " + response);
        }
        throw new RuntimeException("Unknown error from transcript API");
    }
}