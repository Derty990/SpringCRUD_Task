package com.task.campaign.controller;

import com.task.campaign.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/towns")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TownController {

    private final TownService townService;

    @GetMapping
    public ResponseEntity<List<String>> getAllTowns() {
        return ResponseEntity.ok(townService.getAllPredefinedTowns());
    }
}