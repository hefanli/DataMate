package com.datamate.cleaning.infrastructure.persistence.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CleaningResultMapper {
    void deleteByInstanceId(@Param("instanceId") String instanceId);
}
