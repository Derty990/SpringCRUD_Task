package com.futurum.campaign.controller;

import com.futurum.campaign.service.KeywordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/keywords")
@CrossOrigin(origins = "http://localhost:5173")
public class KeywordController {

    private final KeywordService keywordService;

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getKeywordSuggestions(@RequestParam(name = "q", required = false) String query) {
        if (query == null || query.trim().length() < 2) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(keywordService.getTypeaheadSuggestions(query));
    }


}
