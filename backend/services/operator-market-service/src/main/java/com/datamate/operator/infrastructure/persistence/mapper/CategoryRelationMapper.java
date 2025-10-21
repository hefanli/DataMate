package com.datamate.operator.infrastructure.persistence.mapper;

import com.datamate.operator.domain.modal.CategoryRelation;
import com.datamate.operator.domain.modal.RelationCategoryDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CategoryRelationMapper {

    List<RelationCategoryDTO> findAllRelationWithCategory();

    List<CategoryRelation> findAllRelation();

    void batchInsert(@Param("operatorId") String operatorId, @Param("categories") List<Integer> categories);
}
