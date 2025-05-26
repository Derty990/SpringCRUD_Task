package com.task.campaign.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KeywordService {
    private static final List<String> PREDEFINED_KEYWORDS = Arrays.asList(
            // Global
            "promotion", "sale", "new arrival", "bargain", "discount",
            "laptops", "smartphones", "gaming", "computers", "monitors",
            "home appliances", "electronics", "televisions", "washing machines", "refrigerators",
            "services", "maintenance", "repair", "installation",
            "local", "fast", "cheap", "best offer", "hot price",

            // Consumer Electronics
            "tablets", "cameras", "headphones", "speakers", "wearables",
            "smart watch", "e-reader", "projector", "drone", "VR headset",
            "audio system", "home theater", "gaming console", "PC components", "graphics card",
            "motherboard", "RAM", "SSD", "HDD", "power supply",

            // Software & Services
            "software", "antivirus", "operating system", "cloud storage", "web hosting",
            "VPN", "graphic design", "video editing", "office suite", "programming tools",
            "online course", "subscription", "streaming service", "app development", "IT support",

            // Home & Kitchen
            "kitchen appliances", "small appliances", "coffee maker", "blender", "microwave",
            "vacuum cleaner", "air conditioner", "heater", "furniture", "home decor",
            "lighting", "tools", "garden supplies", "DIY", "smart home",

            // Fashion & Lifestyle
            "clothing", "shoes", "accessories", "jewelry", "watches",
            "handbags", "mens fashion", "womens fashion", "kids fashion", "sportswear",
            "outdoor gear", "travel", "luggage", "beauty products", "skincare",

            // Business & Office
            "office supplies", "printers", "scanners", "stationery", "ergonomic chair",
            "desk", "business software", "b2b services", "marketing", "accounting",

            // Deals & Offers
            "limited time offer", "clearance", "flash sale", "special deal", "exclusive",
            "bundle deal", "free shipping", "top rated", "customer favorite", "newly listed",
            "save big", "daily deal", "weekly special", "seasonal offer", "best value"
    );

    /// druga opcja wyszukiwania typeahdead, gdy przykładowo wpisze się "lap", to znajdzie
    ///  słowa takie jak "laptops" oraz "displaylaptop", "overlap" itp.

    /*public List<String> findKeywords(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }

        String searchQuery = query.trim().toLowerCase();

        List<String> matchedKeywords = new ArrayList<>();
        for (String keyword : PREDEFINED_KEYWORDS) {
            if (keyword.toLowerCase().contains(searchQuery)) {
                matchedKeywords.add(keyword);
            }
        }
        return matchedKeywords;

    }*/
    public List<String> getTypeaheadSuggestions(String query) {
        if (query == null || query.trim().length() < 2) {
            return new ArrayList<>();
        }
        String searchQuery = query.trim().toLowerCase();
        return PREDEFINED_KEYWORDS.stream()
                .filter(keyword -> keyword.toLowerCase().startsWith(searchQuery))
                .collect(Collectors.toList());
    }

}
