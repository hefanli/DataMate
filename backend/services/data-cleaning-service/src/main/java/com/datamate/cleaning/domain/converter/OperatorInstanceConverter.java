package com.datamate.cleaning.domain.converter;


import com.datamate.cleaning.domain.model.OperatorInstancePo;
import com.datamate.cleaning.interfaces.dto.OperatorInstance;
import com.datamate.common.infrastructure.exception.BusinessException;
import com.datamate.common.infrastructure.exception.SystemErrorCode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.Map;

@Mapper
public interface OperatorInstanceConverter {
    OperatorInstanceConverter INSTANCE = Mappers.getMapper(OperatorInstanceConverter.class);

    @Mapping(target = "overrides", source = "overrides", qualifiedByName = "mapToJson")
    OperatorInstancePo operatorToDo(OperatorInstance instance);

    @Named("mapToJson")
    static String mapToJson(Map<String, Object> objects) {
         ObjectMapper objectMapper = new ObjectMapper();
         try {
             return objectMapper.writeValueAsString(objects);
         } catch (JsonProcessingException e) {
             throw BusinessException.of(SystemErrorCode.UNKNOWN_ERROR);
         }
    }
}
