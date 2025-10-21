package com.datamate.collection.interfaces.converter;

import com.datamate.collection.domain.model.CollectionTask;
import com.datamate.collection.domain.model.DataxTemplate;
import com.datamate.collection.interfaces.dto.*;
import com.datamate.common.infrastructure.exception.BusinessException;
import com.datamate.common.infrastructure.exception.SystemErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.Map;

@Mapper
public interface CollectionTaskConverter {
    CollectionTaskConverter INSTANCE = Mappers.getMapper(CollectionTaskConverter.class);

    @Mapping(source = "config", target = "config", qualifiedByName = "parseJsonToMap")
    CollectionTaskResponse toResponse(CollectionTask task);

    CollectionTaskSummary toSummary(CollectionTask task);

    DataxTemplateSummary toTemplateSummary(DataxTemplate template);

    @Mapping(source = "config", target = "config", qualifiedByName = "mapToJsonString")
    CollectionTask toCollectionTask(CreateCollectionTaskRequest request);

    @Mapping(source = "config", target = "config", qualifiedByName = "mapToJsonString")
    CollectionTask toCollectionTask(UpdateCollectionTaskRequest request);

    @Named("parseJsonToMap")
    default Map<String, Object> parseJsonToMap(String json) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(json, Map.class);
        } catch (Exception e) {
            throw BusinessException.of(SystemErrorCode.INVALID_PARAMETER);
        }
    }

    @Named("mapToJsonString")
    default String mapToJsonString(Map<String, Object> map) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(map != null ? map : Map.of());
        } catch (Exception e) {
            throw BusinessException.of(SystemErrorCode.INVALID_PARAMETER);
        }
    }
}
