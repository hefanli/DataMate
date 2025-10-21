package com.datamate.collection.infrastructure.runtime.datax;

import com.datamate.collection.domain.model.CollectionTask;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 根据任务配置拼装 DataX 作业 JSON 文件
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataxJobBuilder {

    private final DataxProperties props;

    public Path buildJobFile(CollectionTask task) throws IOException {
        Files.createDirectories(Paths.get(props.getJobConfigPath()));
        String fileName = String.format("datax-job-%s.json", task.getId());
        Path path = Paths.get(props.getJobConfigPath(), fileName);
        // 简化：直接将任务中的 config 字段作为 DataX 作业 JSON
        try (FileWriter fw = new FileWriter(path.toFile())) {
            String json = task.getConfig() == null || task.getConfig().isEmpty() ?
                    defaultJobJson() : task.getConfig();
            if (StringUtils.isNotBlank(task.getConfig())) {
                json = getJobConfig(task);
            }
            log.info("Job config: {}", json);
            fw.write(json);
        }
        return path;
    }

    private String getJobConfig(CollectionTask task) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> parameter = objectMapper.readValue(
                task.getConfig(),
                new TypeReference<>() {}
            );
            Map<String, Object> job = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> reader = new HashMap<>();
            reader.put("name", "nfsreader");
            reader.put("parameter", parameter);
            content.put("reader", reader);
            Map<String, Object> writer = new HashMap<>();
            writer.put("name", "nfswriter");
            writer.put("parameter", parameter);
            content.put("writer", writer);
            job.put("content", List.of(content));
            Map<String, Object> setting = new HashMap<>();
            Map<String, Object> channel = new HashMap<>();
            channel.put("channel", 2);
            setting.put("speed", channel);
            job.put("setting", setting);
            Map<String, Object> jobConfig = new HashMap<>();
            jobConfig.put("job", job);
            return objectMapper.writeValueAsString(jobConfig);
        } catch (Exception e) {
            log.error("Failed to parse task config", e);
            throw new RuntimeException("Failed to parse task config", e);
        }
    }

    private String defaultJobJson() {
        // 提供一个最小可运行的空 job，实际会被具体任务覆盖
        return "{\n  \"job\": {\n    \"setting\": {\n      \"speed\": {\n        \"channel\": 1\n      }\n    },\n    \"content\": []\n  }\n}";
    }
}
