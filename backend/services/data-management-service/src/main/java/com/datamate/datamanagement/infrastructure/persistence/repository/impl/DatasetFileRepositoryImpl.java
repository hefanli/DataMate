package com.datamate.datamanagement.infrastructure.persistence.repository.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.repository.CrudRepository;
import com.datamate.datamanagement.domain.model.dataset.DatasetFile;
import com.datamate.datamanagement.infrastructure.persistence.mapper.DatasetFileMapper;
import com.datamate.datamanagement.infrastructure.persistence.repository.DatasetFileRepository;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.RowBounds;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 数据集文件仓储实现类
 *
 * @author dallas
 * @since 2025-10-15
 */
@Repository
@RequiredArgsConstructor
public class DatasetFileRepositoryImpl extends CrudRepository<DatasetFileMapper, DatasetFile> implements DatasetFileRepository {
    private final DatasetFileMapper datasetFileMapper;

    @Override
    public Long countByDatasetId(String datasetId) {
        return datasetFileMapper.selectCount(new LambdaQueryWrapper<DatasetFile>().eq(DatasetFile::getDatasetId, datasetId));
    }

    @Override
    public Long countCompletedByDatasetId(String datasetId) {
        return datasetFileMapper.countCompletedByDatasetId(datasetId);
    }

    @Override
    public Long sumSizeByDatasetId(String datasetId) {
        return datasetFileMapper.sumSizeByDatasetId(datasetId);
    }

    @Override
    public List<DatasetFile> findAllByDatasetId(String datasetId) {
        return datasetFileMapper.findAllByDatasetId(datasetId);
    }

    @Override
    public DatasetFile findByDatasetIdAndFileName(String datasetId, String fileName) {
        return datasetFileMapper.findByDatasetIdAndFileName(datasetId, fileName);
    }

    @Override
    public List<DatasetFile> findByCriteria(String datasetId, String fileType, String status, RowBounds bounds) {
        return datasetFileMapper.findByCriteria(datasetId, fileType, status, bounds);
    }
}
