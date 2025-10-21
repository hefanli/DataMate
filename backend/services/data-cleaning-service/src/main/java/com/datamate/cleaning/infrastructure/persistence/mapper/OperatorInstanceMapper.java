package com.datamate.cleaning.infrastructure.persistence.mapper;

import com.datamate.cleaning.domain.model.OperatorInstancePo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface OperatorInstanceMapper {

    void insertInstance(@Param("instanceId") String instanceId,
                        @Param("instances") List<OperatorInstancePo> instances);

    void deleteByInstanceId(@Param("instanceId") String instanceId);
}
