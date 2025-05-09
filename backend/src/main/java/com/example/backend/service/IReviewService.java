package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.ReviewDto;

// IReviewService.java
public interface IReviewService {
  ReviewDto createReview(ReviewDto reviewDto, String token);
  List<ReviewDto> getReviewsByProductId(Long productId);
}
