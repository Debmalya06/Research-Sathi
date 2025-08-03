package com.example.research;

import java.util.List;

import org.springframework.boot.autoconfigure.web.WebProperties.Resources.Chain.Strategy.Content;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.servlet.http.Part;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GminiResponse {
    private List<Candidate> candidates;
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
   public static class Candidate
    { private Content content;
    }
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Content {
        private List<Part> parts;
    }
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
     public static class Part {
        private String text;
    }
}
