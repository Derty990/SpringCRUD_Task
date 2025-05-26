package com.task.campaign.controller;


import com.task.campaign.dto.CampaignRequestDto;
import com.task.campaign.dto.CampaignResponseDto;
import com.task.campaign.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/campaigns")
@CrossOrigin(origins = "http://localhost:5173")
public class CampaignController {

    private final CampaignService campaignService;

    @PostMapping
    public ResponseEntity<CampaignResponseDto> createCampaign(@Valid @RequestBody CampaignRequestDto campaignRequestDto) {
        log.info("Received request to create campaign: {}", campaignRequestDto.getCampaignName());
        CampaignResponseDto createdCampaign = campaignService.createCampaign(campaignRequestDto);
        return new ResponseEntity<>(createdCampaign, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CampaignResponseDto>> getAllCampaigns() {
        log.info("Received request to get all campaigns");
        List<CampaignResponseDto> campaigns = campaignService.getAllCampaigns();
        return ResponseEntity.ok(campaigns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignResponseDto> getCampaignById(@PathVariable Long id) {
        log.info("Received request to get campaign with ID: {}", id);
        CampaignResponseDto campaign = campaignService.getCampaignById(id);
        return ResponseEntity.ok(campaign);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampaignResponseDto> updateCampaign(@PathVariable Long id,
                                                              @Valid @RequestBody CampaignRequestDto campaignRequestDto) {
        log.info("Received request to update campaign with ID: {}: {}", id, campaignRequestDto.getCampaignName());
        CampaignResponseDto updatedCampaign = campaignService.updateCampaign(id, campaignRequestDto);
        return ResponseEntity.ok(updatedCampaign);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        log.info("Received request to delete campaign with ID: {}", id);
        campaignService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }


}
