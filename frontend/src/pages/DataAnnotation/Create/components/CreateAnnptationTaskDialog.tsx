import { queryDatasetsUsingGet } from "@/pages/DataManagement/dataset.api";
import { mapDataset } from "@/pages/DataManagement/dataset.const";
import { Button, Form, Input, Modal, Select, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { createAnnotationTaskUsingPost, queryAnnotationTemplatesUsingGet } from "../../annotation.api";
import { Dataset } from "@/pages/DataManagement/dataset.model";
import type { AnnotationTemplate } from "../../annotation.model";
import { useTranslation } from "react-i18next";

export default function CreateAnnotationTask({
  open,
  onClose,
  onRefresh,
}: {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [templates, setTemplates] = useState<AnnotationTemplate[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [nameManuallyEdited, setNameManuallyEdited] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchData = async () => {
      try {
        // Fetch datasets
        const { data: datasetData } = await queryDatasetsUsingGet({
          page: 0,
          pageSize: 1000,  // Use camelCase for HTTP params
        });
        setDatasets(datasetData.content.map(dataset => mapDataset(dataset, t)) || []);

        // Fetch templates
        const templateResponse = await queryAnnotationTemplatesUsingGet({
          page: 1,
          size: 100,  // Backend max is 100 (template API uses 'size' not 'pageSize')
        });

        // The API returns: {code, message, data: {content, total, page, ...}}
        if (templateResponse.code === 200 && templateResponse.data) {
          const fetchedTemplates = templateResponse.data.content || [];
          console.log("Fetched templates:", fetchedTemplates);
          setTemplates(fetchedTemplates);
        } else {
          console.error("Failed to fetch templates:", templateResponse);
          setTemplates([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setTemplates([]);
      }
    };
    fetchData();
  }, [open]);

  // Reset form and manual-edit flag when modal opens
  useEffect(() => {
    if (open) {
      form.resetFields();
      setNameManuallyEdited(false);
    }
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Send templateId instead of labelingConfig
      const requestData = {
        name: values.name,
        description: values.description,
        datasetId: values.datasetId,
        templateId: values.templateId,
      };

      await createAnnotationTaskUsingPost(requestData);
      message?.success?.(t("dataAnnotation.create.messages.createSuccess"));
      onClose();
      onRefresh();
    } catch (err: any) {
      console.error("Create annotation task failed", err);
      const msg = err?.message || err?.data?.message || t("dataAnnotation.create.messages.createFailed");
      (message as any)?.error?.(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t("dataAnnotation.create.title")}
      footer={
        <>
          <Button onClick={onClose} disabled={submitting}>
            {t("dataAnnotation.create.cancel")}
          </Button>
          <Button type="primary" onClick={handleSubmit} loading={submitting}>
            {t("dataAnnotation.create.ok")}
          </Button>
        </>
      }
      width={800}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={t("dataAnnotation.create.form.dataset")}
            name="datasetId"
            rules={[{ required: true, message: t("dataAnnotation.create.form.datasetRequired") }]}
          >
            <Select
              placeholder={t("dataAnnotation.create.form.datasetRequired")}
              options={datasets.map((dataset) => {
                return {
                  label: (
                    <div className="flex items-center justify-between gap-3 py-2">
                      <div className="flex items-center font-sm text-gray-900">
                        <span className="mr-2">{(dataset as any).icon}</span>
                        <span>{dataset.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">{dataset.size}</div>
                    </div>
                  ),
                  value: dataset.id,
                };
              })}
              onChange={(value) => {
                // 如果用户未手动修改名称，则用数据集名称作为默认任务名
                if (!nameManuallyEdited) {
                  const ds = datasets.find((d) => d.id === value);
                  if (ds) {
                    form.setFieldsValue({ name: ds.name });
                  }
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label={t("dataAnnotation.create.form.name")}
            name="name"
            rules={[{ required: true, message: t("dataAnnotation.create.form.nameRequired") }]}
          >
            <Input
              placeholder={t("dataAnnotation.create.form.namePlaceholder")}
              onChange={() => setNameManuallyEdited(true)}
            />
          </Form.Item>
        </div>

        <Form.Item label={t("dataAnnotation.create.form.description")} name="description">
          <TextArea placeholder={t("dataAnnotation.create.form.descriptionPlaceholder")} rows={3} />
        </Form.Item>

        <Form.Item
          label={t("dataAnnotation.create.form.template")}
          name="templateId"
          rules={[{ required: true, message: t("dataAnnotation.create.form.templateRequired") }]}
        >
          <Select
            placeholder={templates.length === 0 ? t("dataAnnotation.create.form.noTemplatesAvailable") : t("dataAnnotation.create.form.selectTemplate")}
            showSearch
            optionFilterProp="label"
            notFoundContent={templates.length === 0 ? t("dataAnnotation.create.form.noTemplatesFound") : t("dataAnnotation.create.form.noTemplatesAvailable")}
            options={templates.map((template) => ({
              label: template.name,
              value: template.id,
              // Add description as subtitle
              title: template.description,
            }))}
            optionRender={(option) => (
              <div>
                <div style={{ fontWeight: 500 }}>{option.label}</div>
                {option.data.title && (
                  <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                    {option.data.title}
                  </div>
                )}
              </div>
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
