package com.example.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Sort;
import lombok.RequiredArgsConstructor;

import com.example.backend.entity.Contract;
import com.example.backend.repository.ContractRepository;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractRepository contractRepository;

    public ContractController(ContractRepository contractRepository) {
        this.contractRepository = contractRepository;
    }

    @GetMapping("/latest")
    public ResponseEntity<Map<String, String>> getLatestContractUrl() {
        Contract latest = contractRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                                            .stream()
                                            .findFirst()
                                            .orElseThrow(() -> new RuntimeException("No contract found"));

        Map<String, String> response = new HashMap<>();
        response.put("title", latest.getTitle());
        response.put("url", latest.getFileUrl()); // Cloudinary URL

        return ResponseEntity.ok(response);
    }
}
