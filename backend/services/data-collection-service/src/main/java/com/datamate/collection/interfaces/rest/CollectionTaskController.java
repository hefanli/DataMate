package com.datamate.collection.interfaces.rest;

import com.datamate.collection.application.service.CollectionTaskService;
import com.datamate.collection.domain.model.CollectionTask;
import com.datamate.collection.domain.model.DataxTemplate;
import com.datamate.collection.interfaces.api.CollectionTaskApi;
import com.datamate.collection.interfaces.converter.CollectionTaskConverter;
import com.datamate.collection.interfaces.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@Validated
public class CollectionTaskController implements CollectionTaskApi {

    private final CollectionTaskService taskService;

    @Override
    public ResponseEntity<CollectionTaskResponse> createTask(CreateCollectionTaskRequest request) {
        CollectionTask task = CollectionTaskConverter.INSTANCE.toCollectionTask(request);
        task.setId(UUID.randomUUID().toString());
        task.addPath();
        return ResponseEntity.ok().body(CollectionTaskConverter.INSTANCE.toResponse(taskService.create(task)));
    }

    @Override
    public ResponseEntity<CollectionTaskResponse> updateTask(String id, UpdateCollectionTaskRequest request) {
        if (taskService.get(id) == null) {
            return ResponseEntity.notFound().build();
        }
        CollectionTask task = CollectionTaskConverter.INSTANCE.toCollectionTask(request);
        task.setId(id);
        return ResponseEntity.ok(CollectionTaskConverter.INSTANCE.toResponse(taskService.update(task)));
    }

    @Override
    public ResponseEntity<Void> deleteTask(String id) {
        taskService.delete(id);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<CollectionTaskResponse> getTaskDetail(String id) {
        CollectionTask task = taskService.get(id);
        return task == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(CollectionTaskConverter.INSTANCE.toResponse(task));
    }

    @Override
    public ResponseEntity<PagedCollectionTaskSummary> getTasks(Integer page, Integer size, TaskStatus status, String name) {
        var list = taskService.list(page, size, status == null ? null : status.getValue(), name);
        PagedCollectionTaskSummary response = new PagedCollectionTaskSummary();
        response.setContent(list.stream().map(CollectionTaskConverter.INSTANCE::toSummary).collect(Collectors.toList()));
        response.setNumber(page);
        response.setSize(size);
        response.setTotalElements(list.size()); // 简化处理，实际项目中应该有单独的count查询
        response.setTotalPages(size == null || size == 0 ? 1 : (int) Math.ceil(list.size() * 1.0 / size));
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<PagedDataxTemplates> templatesGet(String sourceType, String targetType,
                                                           Integer page, Integer size) {
        int pageNum = page != null ? page : 0;
        int pageSize = size != null ? size : 20;
        List<DataxTemplate> templates = taskService.listTemplates(sourceType, targetType, pageNum, pageSize);
        int totalElements = taskService.countTemplates(sourceType, targetType);
        PagedDataxTemplates response = new PagedDataxTemplates();
        response.setContent(templates.stream().map(CollectionTaskConverter.INSTANCE::toTemplateSummary).collect(Collectors.toList()));
        response.setNumber(pageNum);
        response.setSize(pageSize);
        response.setTotalElements(totalElements);
        response.setTotalPages(pageSize > 0 ? (int) Math.ceil(totalElements * 1.0 / pageSize) : 1);
        return ResponseEntity.ok(response);
    }
}
