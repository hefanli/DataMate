package com.datamate.operator.infrastructure.persistence.mapper;

import com.datamate.operator.domain.modal.Category;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CategoryMapper {

    List<Category> findAllCategories();
}
