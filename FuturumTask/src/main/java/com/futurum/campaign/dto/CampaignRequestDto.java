package com.futurum.campaign.dto;

import com.futurum.campaign.enums.CampaignStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampaignRequestDto {

    @NotBlank(message = "Campaign name is mandatory")
    private String campaignName;

    @NotBlank(message = "Keywords are mandatory")
    private String keywords;

    @NotNull(message = "Bid amount is mandatory")
    @DecimalMin(value = "0.01", inclusive = true, message = "Bid amount must be at least 0.01")
    private BigDecimal bidAmount;

    @NotNull(message = "Campaign fund is mandatory")
    @DecimalMin(value = "0.01", inclusive = true, message = "Campaign fund must be positive")
    private BigDecimal campaignFund;

    @NotNull(message = "Status is mandatory")
    private CampaignStatus status;

    private String town;

    @NotNull(message = "Radius is mandatory")
    @Min(value = 1, message = "Radius must be at least 1 kilometer")
    private Integer radius;

    @NotNull(message = "Seller's id required")
    private Long sellerId;
}