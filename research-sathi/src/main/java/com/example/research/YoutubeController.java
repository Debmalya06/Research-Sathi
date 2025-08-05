package com.example.research;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/youtube")
@RequiredArgsConstructor
public class YoutubeController {

    private final YoutubeService youtubeService;

    @PostMapping("/transcript")
    public ResponseEntity<String> getTranscript(@RequestBody YoutubeTranscriptRequest request) {
        try {
            String transcript = youtubeService.getTranscriptFromUrl(request.getUrl());
            return ResponseEntity.ok(transcript);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}