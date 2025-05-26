package com.futurum.campaign.entity;

import com.futurum.campaign.enums.CampaignStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "campaigns")
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String campaignName;

    @NotBlank
    private String keywords;

    @NotNull
    @DecimalMin(value = "0.01", inclusive = true)
    private BigDecimal bidAmount;

    @NotNull
    private BigDecimal campaignFund;

    @NotNull
    @Enumerated(EnumType.STRING)
    private CampaignStatus status;

    private String town;

    @NotNull
    @Min(1)
    private Integer radius;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;


}
