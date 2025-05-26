package com.task.campaign.service;

import com.task.campaign.dto.CampaignRequestDto;
import com.task.campaign.dto.CampaignResponseDto;
import com.task.campaign.entity.Campaign;
import com.task.campaign.entity.Seller;
import com.task.campaign.repository.CampaignRepository;
import com.task.campaign.repository.SellerRepository;
import com.task.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final SellerRepository sellerRepository;

    private CampaignResponseDto mapToCampaignResponseDto(Campaign campaign) {
        if (campaign == null) {
            log.warn("Attempted to map a null Campaign to CampaignResponseDto");
            return null;
        }
        Seller seller = campaign.getSeller();
        Long sellerId = null;
        String sellerName = null;
        BigDecimal sellerBalance = null;

        if (seller != null) {
            sellerId = seller.getId();
            sellerName = seller.getName();
            sellerBalance = seller.getEmeraldBalance();
        } else {
            log.warn("Campaign with ID {} has no associated seller.", campaign.getId());
        }

        return new CampaignResponseDto(
                campaign.getId(),
                campaign.getCampaignName(),
                campaign.getKeywords(),
                campaign.getBidAmount(),
                campaign.getCampaignFund(),
                campaign.getStatus(),
                campaign.getTown(),
                campaign.getRadius(),
                sellerId,
                sellerName,
                sellerBalance
        );
    }

    @Transactional
    public CampaignResponseDto createCampaign(CampaignRequestDto campaignRequestDto) {
        log.info("Attempting to create campaign with data: {}", campaignRequestDto);

        Seller seller = sellerRepository.findById(campaignRequestDto.getSellerId())
                .orElseThrow(() -> {
                    log.error("Seller not found with ID: {}", campaignRequestDto.getSellerId());
                    return new ResourceNotFoundException("Seller", "id", campaignRequestDto.getSellerId());
                });
        log.info("Found seller: {}", seller.getName());

        if (seller.getEmeraldBalance().compareTo(campaignRequestDto.getCampaignFund()) < 0) {
            log.warn("Insufficient funds for seller ID: {}. Required: {}, Available: {}",
                    seller.getId(), campaignRequestDto.getCampaignFund(), seller.getEmeraldBalance());
            throw new RuntimeException("Niewystarczające środki na koncie Emerald sprzedawcy: " + seller.getName());
        }

        BigDecimal newBalance = seller.getEmeraldBalance().subtract(campaignRequestDto.getCampaignFund());
        seller.setEmeraldBalance(newBalance);
        sellerRepository.save(seller);
        log.info("Seller ID: {} balance updated to: {}", seller.getId(), newBalance);

        Campaign campaign = new Campaign();
        campaign.setCampaignName(campaignRequestDto.getCampaignName());
        campaign.setKeywords(campaignRequestDto.getKeywords());
        campaign.setBidAmount(campaignRequestDto.getBidAmount());
        campaign.setCampaignFund(campaignRequestDto.getCampaignFund());
        campaign.setStatus(campaignRequestDto.getStatus());
        campaign.setTown(campaignRequestDto.getTown());
        campaign.setRadius(campaignRequestDto.getRadius());
        campaign.setSeller(seller);

        Campaign savedCampaign = campaignRepository.save(campaign);
        log.info("Campaign created successfully with ID: {}", savedCampaign.getId());
        return mapToCampaignResponseDto(savedCampaign);
    }

    @Transactional(readOnly = true)
    public List<CampaignResponseDto> getAllCampaigns() {
        log.info("Fetching all campaigns");
        List<Campaign> campaigns = campaignRepository.findAll();
        log.info("Found {} campaigns in database", campaigns.size());
        return campaigns.stream()
                .map(this::mapToCampaignResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CampaignResponseDto getCampaignById(Long id) {
        log.info("Fetching campaign with ID: {}", id);
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Campaign not found with ID: {}", id);
                    return new ResourceNotFoundException("Campaign", "id", id);
                });
        return mapToCampaignResponseDto(campaign);
    }

    @Transactional
    public CampaignResponseDto updateCampaign(Long campaignId, CampaignRequestDto campaignRequestDto) {
        log.info("Attempting to update campaign with ID: {} and data: {}", campaignId, campaignRequestDto);

        Campaign existingCampaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> {
                    log.warn("Campaign not found for update with ID: {}", campaignId);
                    return new ResourceNotFoundException("Campaign", "id", campaignId);
                });

        Seller seller = existingCampaign.getSeller();
        if (campaignRequestDto.getSellerId() != null && !campaignRequestDto.getSellerId().equals(seller.getId())) {
            log.warn("Attempt to change seller for campaign ID: {} is not allowed or not implemented.", campaignId);
        }

        BigDecimal oldFund = existingCampaign.getCampaignFund();
        BigDecimal newFund = campaignRequestDto.getCampaignFund();
        BigDecimal fundDifference = oldFund.subtract(newFund);

        BigDecimal potentialNewSellerBalance = seller.getEmeraldBalance().add(fundDifference);
        if (potentialNewSellerBalance.compareTo(BigDecimal.ZERO) < 0) {
            log.warn("Insufficient funds for seller ID: {} to cover fund change for campaign ID: {}. Required change: {}, Available: {}",
                    seller.getId(), campaignId, newFund.subtract(oldFund), seller.getEmeraldBalance());
            throw new RuntimeException("Niewystarczające środki na koncie Emerald sprzedawcy do pokrycia zmiany funduszu kampanii.");
        }

        seller.setEmeraldBalance(potentialNewSellerBalance);
        sellerRepository.save(seller);
        log.info("Seller ID: {} balance updated to: {} due to campaign {} fund change.", seller.getId(), potentialNewSellerBalance, campaignId);

        existingCampaign.setCampaignName(campaignRequestDto.getCampaignName());
        existingCampaign.setKeywords(campaignRequestDto.getKeywords());
        existingCampaign.setBidAmount(campaignRequestDto.getBidAmount());
        existingCampaign.setCampaignFund(newFund);
        existingCampaign.setStatus(campaignRequestDto.getStatus());
        existingCampaign.setTown(campaignRequestDto.getTown());
        existingCampaign.setRadius(campaignRequestDto.getRadius());

        Campaign updatedCampaign = campaignRepository.save(existingCampaign);
        log.info("Campaign updated successfully with ID: {}", updatedCampaign.getId());
        return mapToCampaignResponseDto(updatedCampaign);
    }

    @Transactional
    public void deleteCampaign(Long campaignId) {
        log.info("Attempting to delete campaign with ID: {}", campaignId);
        Campaign campaignToDelete = campaignRepository.findById(campaignId)
                .orElseThrow(() -> {
                    log.warn("Campaign not found for deletion with ID: {}", campaignId);
                    return new ResourceNotFoundException("Campaign", "id", campaignId);
                });

        Seller seller = campaignToDelete.getSeller();
        BigDecimal campaignFundToReturn = campaignToDelete.getCampaignFund();
        seller.setEmeraldBalance(seller.getEmeraldBalance().add(campaignFundToReturn));
        sellerRepository.save(seller);
        log.info("Returned fund {} to seller ID: {}. New balance: {}",
                campaignFundToReturn, seller.getId(), seller.getEmeraldBalance());

        campaignRepository.delete(campaignToDelete);
        log.info("Campaign deleted successfully with ID: {}", campaignId);
    }
}