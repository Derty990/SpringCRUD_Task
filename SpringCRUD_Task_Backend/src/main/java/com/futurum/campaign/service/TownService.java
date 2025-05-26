package com.futurum.campaign.service;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class TownService {
    private static final List<String> PREDEFINED_TOWNS = Arrays.asList(
            "Warszawa",
            "Kraków",
            "Łódź",
            "Wrocław",
            "Poznań",
            "Gdańsk",
            "Szczecin",
            "Bydgoszcz",
            "Lublin",
            "Katowice"
    );

    public List<String> getAllPredefinedTowns() {
        return PREDEFINED_TOWNS;
    }
}
