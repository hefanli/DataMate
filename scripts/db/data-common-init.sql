-- 数据归集服务数据库初始化脚本
-- 适用于datamate数据库

USE datamate;

CREATE TABLE IF NOT EXISTS `t_chunk_upload_request`
(
  `id`                VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
  `total_file_num`    INT COMMENT '总文件数',
  `uploaded_file_num` INT COMMENT '已上传文件数',
  `upload_path`       VARCHAR(256) COMMENT '文件路径',
  `timeout`           TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传请求超时时间',
  `service_id`        VARCHAR(64) COMMENT '上传请求所属服务：DATA-MANAGEMENT(数据管理);',
  `check_info`         TEXT COMMENT '业务信息'
) COMMENT ='文件切片上传请求表';
