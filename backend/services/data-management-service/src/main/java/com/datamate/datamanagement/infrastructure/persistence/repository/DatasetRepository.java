package com.datamate.datamanagement.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.repository.IRepository;
import com.datamate.datamanagement.domain.model.dataset.Dataset;
import com.datamate.datamanagement.interfaces.dto.AllDatasetStatisticsResponse;
import com.datamate.datamanagement.interfaces.dto.DatasetPagingQuery;
import org.apache.ibatis.session.RowBounds;

import java.util.List;


/**
 * 数据集仓储层
 *
 * @author dallas
 * @since 2025-10-15
 */
public interface DatasetRepository extends IRepository<Dataset> {
    Dataset findByName(String name);

    List<Dataset> findByCriteria(String type, String status, String keyword, List<String> tagList, RowBounds bounds);

    long countByCriteria(String type, String status, String keyword, List<String> tagList);

    AllDatasetStatisticsResponse getAllDatasetStatistics();

    IPage<Dataset> findByCriteria(IPage<Dataset> page, DatasetPagingQuery query);
}
