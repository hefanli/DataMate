package com.datamate.datamanagement.domain.model.dataset;

import com.datamate.common.domain.model.UploadCheckInfo;
import lombok.Getter;
import lombok.Setter;

/**
 * 数据集文件上传检查信息
 */
@Getter
@Setter
public class DatasetFileUploadCheckInfo extends UploadCheckInfo {
    /** 数据集id */
    private String datasetId;

    /** 是否为压缩包上传 */
    private boolean hasArchive;
}
