package com.futurum.campaign.controller;

import com.futurum.campaign.dto.SellerDto;
import com.futurum.campaign.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sellers")
@CrossOrigin(origins = "http://localhost:5173")
public class SellerController {

    private final SellerService sellerService;

    @GetMapping
    public ResponseEntity<List<SellerDto>> getAllSellers() {
        List<SellerDto> sellers = sellerService.getAllSellers();
        return new ResponseEntity<>(sellers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SellerDto> getSellerById(@PathVariable Long id) {
        SellerDto sellerDto = sellerService.getSellerById(id);
        return ResponseEntity.ok(sellerDto);
    }
}