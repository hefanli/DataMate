package com.datamate.collection.application.service;

import com.datamate.collection.domain.model.CollectionTask;
import com.datamate.collection.domain.model.TaskExecution;
import com.datamate.collection.domain.model.TaskStatus;
import com.datamate.collection.domain.model.DataxTemplate;
import com.datamate.collection.infrastructure.persistence.mapper.CollectionTaskMapper;
import com.datamate.collection.infrastructure.persistence.mapper.TaskExecutionMapper;
import com.datamate.collection.interfaces.dto.SyncMode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class CollectionTaskService {
    private final CollectionTaskMapper taskMapper;
    private final TaskExecutionMapper executionMapper;
    private final DataxExecutionService dataxExecutionService;

    @Transactional
    public CollectionTask create(CollectionTask task) {
        task.setStatus(TaskStatus.READY);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        taskMapper.insert(task);
        executeTaskNow(task);
        return task;
    }

    private void executeTaskNow(CollectionTask task) {
        if (Objects.equals(task.getSyncMode(), SyncMode.ONCE.getValue())) {
            TaskExecution exec = dataxExecutionService.createExecution(task);
            int timeout = task.getTimeoutSeconds() == null ? 3600 : task.getTimeoutSeconds();
            dataxExecutionService.runAsync(task, exec.getId(), timeout);
            log.info("Triggered DataX execution for task {} at {}, execId={}", task.getId(), LocalDateTime.now(), exec.getId());
        }
    }

    @Transactional
    public CollectionTask update(CollectionTask task) {
        task.setUpdatedAt(LocalDateTime.now());
        taskMapper.update(task);
        return task;
    }

    @Transactional
    public void delete(String id) { taskMapper.deleteById(id); }

    public CollectionTask get(String id) { return taskMapper.selectById(id); }

    public List<CollectionTask> list(Integer page, Integer size, String status, String name) {
        Map<String, Object> p = new HashMap<>();
        p.put("status", status);
        p.put("name", name);
        if (page != null && size != null) {
            p.put("offset", page * size);
            p.put("limit", size);
        }
        return taskMapper.selectAll(p);
    }

    @Transactional
    public TaskExecution startExecution(CollectionTask task) {
        return dataxExecutionService.createExecution(task);
    }

    // ---- Template related merged methods ----
    public List<DataxTemplate> listTemplates(String sourceType, String targetType, int page, int size) {
        int offset = page * size;
        return taskMapper.selectList(sourceType, targetType, offset, size);
    }

    public int countTemplates(String sourceType, String targetType) {
        return taskMapper.countTemplates(sourceType, targetType);
    }
}
