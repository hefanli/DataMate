package com.datamate.cleaning.infrastructure.persistence.mapper;

import com.datamate.cleaning.interfaces.dto.CleaningTask;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CleaningTaskMapper {
    List<CleaningTask> findTasks(@Param("status") String status, @Param("keywords") String keywords,
                                         @Param("size") Integer size, @Param("offset") Integer offset);

    CleaningTask findTaskById(@Param("taskId") String taskId);

    void insertTask(CleaningTask task);

    void updateTask(CleaningTask task);

    void deleteTask(@Param("taskId") String taskId);
}
