package com.datamate.operator.interfaces.rest;

import com.datamate.common.interfaces.PagedResponse;
import com.datamate.operator.application.CategoryService;
import com.datamate.operator.interfaces.dto.CategoryTreeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/tree")
    public PagedResponse<CategoryTreeResponse> categoryTreeGet() {
        List<CategoryTreeResponse> allCategories = categoryService.getAllCategories();
        return PagedResponse.of(allCategories);
    }
}
