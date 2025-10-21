package com.datamate.collection.domain.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskExecution {
    private String id;
    private String taskId;
    private String taskName;
    private TaskStatus status;
    private Double progress;
    private Long recordsTotal;
    private Long recordsProcessed;
    private Long recordsSuccess;
    private Long recordsFailed;
    private Double throughput;
    private Long dataSizeBytes;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Integer durationSeconds;
    private String errorMessage;
    private String dataxJobId;
    private String config;
    private String result;
    private LocalDateTime createdAt;

    public static TaskExecution initTaskExecution() {
        TaskExecution exec = new TaskExecution();
        exec.setId(UUID.randomUUID().toString());
        exec.setStatus(TaskStatus.RUNNING);
        exec.setProgress(0.0);
        exec.setStartedAt(LocalDateTime.now());
        exec.setCreatedAt(LocalDateTime.now());
        return exec;
    }
}
