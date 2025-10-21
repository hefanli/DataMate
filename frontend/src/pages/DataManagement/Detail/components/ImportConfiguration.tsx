import { Select, Input, Form, Radio, Modal, Button } from "antd";
import { dataSourceOptions } from "../../dataset.const";
import { Dataset, DataSource } from "../../dataset.model";
import { useEffect, useState } from "react";
import { queryTasksUsingGet } from "@/pages/DataCollection/collection.apis";
import { useImportFile } from "../../hooks";
import { updateDatasetByIdUsingPut } from "../../dataset.api";

export default function ImportConfiguration({
  data,
  open,
  onClose,
  onRefresh,
}: {
  data?: Dataset;
  open: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}) {
  const [form] = Form.useForm();
  const [collectionOptions, setCollectionOptions] = useState([]);
  const [importConfig, setImportConfig] = useState<any>({
    source: DataSource.UPLOAD,
  });
  const { importFileRender, handleUpload } = useImportFile();

  // 获取归集任务列表
  const fetchCollectionTasks = async () => {
    try {
      const res = await queryTasksUsingGet({ page: 0, size: 100 });
      const options = res.data.content.map((task: any) => ({
        label: task.name,
        value: task.id,
      }));
      setCollectionOptions(options);
    } catch (error) {
      console.error("Error fetching collection tasks:", error);
    }
  };

  const resetState = () => {
    form.resetFields();
    setImportConfig({ source: DataSource.UPLOAD });
  };

  const handleImportData = async () => {
    if (importConfig.source === DataSource.UPLOAD) {
      await handleUpload(data);
    } else if (importConfig.source === DataSource.COLLECTION) {
      await updateDatasetByIdUsingPut(data?.id!, {
        ...importConfig,
      });
    }
    resetState();
    onRefresh?.();
    onClose();
  };

  useEffect(() => {
    if (open) fetchCollectionTasks();
  }, [open]);

  return (
    <Modal
      title="导入数据"
      open={open}
      width={600}
      onCancel={onClose}
      maskClosable={false}
      footer={
        <>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleImportData}>
            确定
          </Button>
        </>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={importConfig || {}}
        onValuesChange={(_, allValues) => setImportConfig(allValues)}
      >
        <Form.Item
          label="数据源"
          name="source"
          rules={[{ required: true, message: "请选择数据源" }]}
        >
          <Radio.Group
            buttonStyle="solid"
            options={dataSourceOptions}
            optionType="button"
          />
        </Form.Item>
        {importConfig?.source === DataSource.COLLECTION && (
          <Form.Item name="dataSource" label="归集任务" required>
            <Select placeholder="请选择归集任务" options={collectionOptions} />
          </Form.Item>
        )}

        {/* nas import */}
        {importConfig?.source === DataSource.NAS && (
          <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50 rounded-lg">
            <Form.Item
              name="nasPath"
              rules={[{ required: true }]}
              label="NAS地址"
            >
              <Input placeholder="192.168.1.100" />
            </Form.Item>
            <Form.Item
              name="sharePath"
              rules={[{ required: true }]}
              label="共享路径"
            >
              <Input placeholder="/share/importConfig" />
            </Form.Item>
            <Form.Item
              name="username"
              rules={[{ required: true }]}
              label="用户名"
            >
              <Input placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true }]}
              label="密码"
            >
              <Input type="password" placeholder="密码" />
            </Form.Item>
          </div>
        )}
        {/* obs import */}
        {importConfig?.source === DataSource.OBS && (
          <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50 rounded-lg">
            <Form.Item
              name="endpoint"
              rules={[{ required: true }]}
              label="Endpoint"
            >
              <Input
                className="h-8 text-xs"
                placeholder="obs.cn-north-4.myhuaweicloud.com"
              />
            </Form.Item>
            <Form.Item
              name="bucket"
              rules={[{ required: true }]}
              label="Bucket"
            >
              <Input className="h-8 text-xs" placeholder="my-bucket" />
            </Form.Item>
            <Form.Item
              name="accessKey"
              rules={[{ required: true }]}
              label="Access Key"
            >
              <Input className="h-8 text-xs" placeholder="Access Key" />
            </Form.Item>
            <Form.Item
              name="secretKey"
              rules={[{ required: true }]}
              label="Secret Key"
            >
              <Input
                type="password"
                className="h-8 text-xs"
                placeholder="Secret Key"
              />
            </Form.Item>
          </div>
        )}

        {/* Local Upload Component */}
        {importConfig?.source === DataSource.UPLOAD && (
          <Form.Item
            label="上传文件"
            name="files"
            rules={[
              {
                required: true,
                message: "请上传文件",
              },
            ]}
          >
            {importFileRender()}
          </Form.Item>
        )}

        {/* Target Configuration */}
        {importConfig?.target && importConfig?.target !== DataSource.UPLOAD && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
            {importConfig?.target === DataSource.DATABASE && (
              <div className="grid grid-cols-2 gap-3">
                <Form.Item
                  name="databaseType"
                  rules={[{ required: true }]}
                  label="数据库类型"
                >
                  <Select
                    className="w-full"
                    options={[
                      { label: "MySQL", value: "mysql" },
                      { label: "PostgreSQL", value: "postgresql" },
                      { label: "MongoDB", value: "mongodb" },
                    ]}
                  ></Select>
                </Form.Item>
                <Form.Item
                  name="tableName"
                  rules={[{ required: true }]}
                  label="表名"
                >
                  <Input className="h-8 text-xs" placeholder="dataset_table" />
                </Form.Item>
                <Form.Item
                  name="connectionString"
                  rules={[{ required: true }]}
                  label="连接字符串"
                >
                  <Input
                    className="h-8 text-xs col-span-2"
                    placeholder="数据库连接字符串"
                  />
                </Form.Item>
              </div>
            )}
          </div>
        )}
      </Form>
    </Modal>
  );
}
