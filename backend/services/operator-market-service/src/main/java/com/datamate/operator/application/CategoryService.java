package com.datamate.operator.application;


import com.datamate.operator.domain.modal.Category;
import com.datamate.operator.domain.modal.CategoryRelation;
import com.datamate.operator.infrastructure.persistence.mapper.CategoryMapper;
import com.datamate.operator.infrastructure.persistence.mapper.CategoryRelationMapper;
import com.datamate.operator.interfaces.dto.CategoryTreeResponse;
import com.datamate.operator.interfaces.dto.SubCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryMapper categoryMapper;

    private final CategoryRelationMapper categoryRelationMapper;

    public List<CategoryTreeResponse> getAllCategories() {
        List<Category> allCategories = categoryMapper.findAllCategories();
        List<CategoryRelation> allRelations = categoryRelationMapper.findAllRelation();

        Map<Integer, Integer> relationMap = allRelations.stream()
                .collect(Collectors.groupingBy(
                        CategoryRelation::getCategoryId,
                        Collectors.collectingAndThen(Collectors.counting(), Math::toIntExact)));

        Map<Integer, String> nameMap = allCategories.stream()
                .collect(Collectors.toMap(Category::getId, Category::getName));
        Map<Integer, List<Category>> groupedByParentId = allCategories.stream()
                .filter(relation -> relation.getParentId() > 0)
                .collect(Collectors.groupingBy(Category::getParentId));

        return groupedByParentId.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    Integer parentId = entry.getKey();
                    List<Category> group = entry.getValue();
                    CategoryTreeResponse response = new CategoryTreeResponse();
                    response.setId(parentId);
                    response.setName(nameMap.get(parentId));
                    AtomicInteger totalCount = new AtomicInteger();
                    response.setCategories(group.stream().map(category -> {
                        SubCategory subCategory = new SubCategory();
                        subCategory.setId(category.getId());
                        subCategory.setName(category.getName());
                        subCategory.setCount(relationMap.getOrDefault(category.getId(), 0));
                        totalCount.getAndAdd(relationMap.getOrDefault(category.getId(), 0));
                        subCategory.setParentId(parentId);
                        return subCategory;
                    }).toList());
                    response.setCount(totalCount.get());
                    return response;
                }).toList();
    }
}
