package com.task.campaign.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerDto {
    private Long id;
    private String name;
    private BigDecimal emeraldBalance;
}
