package com.datamate.datamanagement.interfaces.dto;

import com.datamate.common.interfaces.PagingQuery;
import com.datamate.datamanagement.common.enums.DatasetStatusType;
import com.datamate.datamanagement.common.enums.DatasetType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * 数据集分页查询请求
 *
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DatasetPagingQuery extends PagingQuery {
    /**
     * 数据集类型过滤
     */
    private DatasetType type;

    /**
     * 标签名过滤
     */
    private List<String> tags = new ArrayList<>();

    /**
     * 关键词搜索（名称或描述）
     */
    private String keyword;

    /**
     * 状态过滤
     */
    private DatasetStatusType status;
}
