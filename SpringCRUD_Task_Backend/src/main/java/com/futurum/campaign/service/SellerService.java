package com.futurum.campaign.service;

import com.futurum.campaign.dto.SellerDto;
import com.futurum.campaign.entity.Seller;
import com.futurum.campaign.repository.SellerRepository;
import com.futurum.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SellerService {

    private final SellerRepository sellerRepository;

    private SellerDto mapToSellerDto(Seller seller) {
        if (seller == null) {
            log.warn("Attempted to map a null Seller to SellerDto");
            return null;
        }
        return new SellerDto(
                seller.getId(),
                seller.getName(),
                seller.getEmeraldBalance()
        );
    }

    @Transactional(readOnly = true)
    public List<SellerDto> getAllSellers() {
        log.info("Fetching all sellers");
        List<Seller> sellers = sellerRepository.findAll();
        log.info("Found {} sellers in database", sellers.size());
        return sellers.stream()
                .map(this::mapToSellerDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SellerDto getSellerById(Long id) {
        log.info("Fetching seller with ID: {}", id);
        return sellerRepository.findById(id)
                .map(this::mapToSellerDto)
                .orElseThrow(() -> {
                    log.warn("Seller not found with ID: {}", id);
                    return new ResourceNotFoundException("Seller", "id", id);
                });
    }
}