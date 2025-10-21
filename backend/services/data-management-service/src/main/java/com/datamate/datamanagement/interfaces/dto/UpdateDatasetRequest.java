package com.datamate.datamanagement.interfaces.dto;

import com.datamate.datamanagement.common.enums.DatasetStatusType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * 更新数据集请求DTO
 */
@Getter
@Setter
public class UpdateDatasetRequest {
    /** 数据集名称 */
    private String name;
    /** 数据集描述 */
    private String description;
    /** 归集任务id */
    private String dataSource;
    /** 标签列表 */
    private List<String> tags;
    /** 数据集状态 */
    private DatasetStatusType status;
}
