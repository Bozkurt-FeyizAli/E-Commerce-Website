package com.example.backend.service;

import com.example.backend.dto.CategoryDto;

import java.util.List;

public interface ICategoryService {

    CategoryDto createCategory(CategoryDto categoryDto);

    CategoryDto updateCategory(Long id, CategoryDto categoryDto);

    void deleteCategory(Long id);

    CategoryDto getCategoryById(Long id);

    List<CategoryDto> getAllActiveCategories();
}
