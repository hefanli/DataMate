package com.datamate.common.models.infrastructure.persistence.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.repository.CrudRepository;
import com.datamate.common.models.domain.entity.ModelConfig;
import com.datamate.common.models.domain.repository.ModelConfigRepository;
import com.datamate.common.models.infrastructure.persistence.mapper.ModelConfigMapper;
import com.datamate.common.models.interfaces.rest.dto.QueryModelRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.Objects;

/**
 * 模型配置仓库实现类
 *
 * @author dallas
 * @since 2025-10-27
 */
@Repository
@RequiredArgsConstructor
public class ModelConfigRepositoryImpl extends CrudRepository<ModelConfigMapper, ModelConfig> implements ModelConfigRepository {
    private final ModelConfigMapper modelConfigMapper;


    @Override
    public IPage<ModelConfig> page(QueryModelRequest queryModelRequest) {
        IPage<ModelConfig> page = new Page<>(queryModelRequest.getPage(), queryModelRequest.getSize());
        return this.page(page, new LambdaQueryWrapper<ModelConfig>()
                .eq(StringUtils.hasText(queryModelRequest.getProvider()), ModelConfig::getProvider, queryModelRequest.getProvider())
                .eq(Objects.nonNull(queryModelRequest.getType()), ModelConfig::getType, queryModelRequest.getType())
                .eq(Objects.nonNull(queryModelRequest.getIsEnabled()), ModelConfig::getIsEnabled, queryModelRequest.getIsEnabled()));
    }
}
