package com.datamate.collection.domain.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;

@Data
public class CollectionTask {
    private String id;
    private String name;
    private String description;
    private String config; // DataX JSON 配置，包含源端和目标端配置信息
    private TaskStatus status;
    private String syncMode; // ONCE / SCHEDULED
    private String scheduleExpression;
    private Integer retryCount;
    private Integer timeoutSeconds;
    private Long maxRecords;
    private String sortField;
    private String lastExecutionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    public void addPath() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> parameter = objectMapper.readValue(
                config,
                new TypeReference<>() {}
            );
            parameter.put("destPath", "/dataset/local/" + id);
            parameter.put("filePaths", Collections.singletonList(parameter.get("destPath")));
            config = objectMapper.writeValueAsString(parameter);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
