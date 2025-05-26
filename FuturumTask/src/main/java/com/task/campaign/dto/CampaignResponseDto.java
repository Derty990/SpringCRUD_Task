package com.task.campaign.dto;

import com.task.campaign.enums.CampaignStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampaignResponseDto {
    private Long id;
    private String campaignName;
    private String keywords;
    private BigDecimal bidAmount;
    private BigDecimal campaignFund;
    private CampaignStatus status;
    private String town;
    private Integer radius;
    //W realnym przypadku pola id oraz wrażliwe informacje nie mogą być wyświetlane ani dostępne z poziomu klienta
    private Long sellerId;
    private String sellerName;
    private BigDecimal sellerEmeraldBalanceAfterTransaction;
}
