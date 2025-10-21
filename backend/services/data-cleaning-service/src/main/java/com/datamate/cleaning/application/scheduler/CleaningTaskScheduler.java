package com.datamate.cleaning.application.scheduler;

import com.datamate.cleaning.application.httpclient.RuntimeClient;
import com.datamate.cleaning.infrastructure.persistence.mapper.CleaningTaskMapper;
import com.datamate.cleaning.interfaces.dto.CleaningTask;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
public class CleaningTaskScheduler {
    private final CleaningTaskMapper cleaningTaskMapper;

    private final ExecutorService taskExecutor = Executors.newFixedThreadPool(5);

    public void executeTask(String taskId) {
        taskExecutor.submit(() -> submitTask(taskId));
    }

    private void submitTask(String taskId) {
        CleaningTask task = new CleaningTask();
        task.setId(taskId);
        task.setStatus(CleaningTask.StatusEnum.RUNNING);
        task.setStartedAt(LocalDateTime.now());
        cleaningTaskMapper.updateTask(task);
        RuntimeClient.submitTask(taskId);
    }

    public void stopTask(String taskId) {
        RuntimeClient.stopTask(taskId);
        CleaningTask task = new CleaningTask();
        task.setId(taskId);
        task.setStatus(CleaningTask.StatusEnum.STOPPED);
        cleaningTaskMapper.updateTask(task);
    }
}
