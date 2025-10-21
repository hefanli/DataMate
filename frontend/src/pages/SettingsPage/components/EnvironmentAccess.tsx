import { Card, Button, Form, Input, Modal, Select, Badge } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExperimentOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { useState } from "react";

interface VectorDBConfig {
  id: string;
  name: string;
  type: "pinecone" | "weaviate" | "qdrant" | "milvus" | "chroma";
  url: string;
  apiKey: string;
  dimension: number;
  metric: string;
  status: "connected" | "disconnected" | "error";
}

interface ModelConfig {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "google" | "azure" | "local";
  model: string;
  apiKey: string;
  endpoint?: string;
  status: "active" | "inactive";
  usage: number;
}

export default function EnvironmentAccess() {
  const [form] = Form.useForm();
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [showVectorDBDialog, setShowVectorDBDialog] = useState(false);
  const [showModelDialog, setShowModelDialog] = useState(false);

  const [vectorDBs, setVectorDBs] = useState<VectorDBConfig[]>([
    {
      id: "1",
      name: "Pinecone Production",
      type: "pinecone",
      url: "https://your-index.svc.us-east1-gcp.pinecone.io",
      apiKey: "pc-****-****-****",
      dimension: 1536,
      metric: "cosine",
      status: "connected",
    },
    {
      id: "2",
      name: "Weaviate Local",
      type: "weaviate",
      url: "http://localhost:8080",
      apiKey: "",
      dimension: 768,
      metric: "cosine",
      status: "disconnected",
    },
  ]);
  const [providerOptions] = useState([
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "google", label: "Google" },
    { value: "azure", label: "Azure" },
    { value: "local", label: "本地部署" },
  ]);
  const [models, setModels] = useState<ModelConfig[]>([
    {
      id: "1",
      name: "GPT-4 Turbo",
      provider: "openai",
      model: "gpt-4-turbo-preview",
      apiKey: "sk-****-****-****",
      status: "active",
      usage: 85,
    },
    {
      id: "2",
      name: "Claude 3 Sonnet",
      provider: "anthropic",
      model: "claude-3-sonnet-20240229",
      apiKey: "sk-ant-****-****",
      status: "active",
      usage: 42,
    },
  ]);

  const [dbOptions] = useState([
    { value: "pinecone", label: "Pinecone" },
    { value: "weaviate", label: "Weaviate" },
    { value: "qdrant", label: "Qdrant" },
    { value: "milvus", label: "Milvus" },
    { value: "chroma", label: "Chroma" },
  ]);
  const [metricOptions] = useState([
    { value: "cosine", label: "Cosine" },
    { value: "euclidean", label: "Euclidean" },
    { value: "dotproduct", label: "Dot Product" },
  ]);

  const [newVectorDB, setNewVectorDB] = useState({
    name: "",
    type: "pinecone",
    url: "",
    apiKey: "",
    dimension: 1536,
    metric: "cosine",
  });
  const [newModel, setNewModel] = useState({
    name: "",
    provider: "openai",
    model: "",
    apiKey: "",
    endpoint: "",
  });

  const handleAddVectorDB = () => {
    setNewVectorDB({
      name: "",
      type: "pinecone",
      url: "",
      apiKey: "",
      dimension: 1536,
      metric: "cosine",
    });
    setShowVectorDBDialog(true);
  };

  const handleAddModel = () => {
    setNewModel({
      name: "",
      provider: "openai",
      model: "",
      apiKey: generateApiKey(),
      endpoint: "",
    });
    setShowModelDialog(true);
  };
  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const generateApiKey = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "sk-";
    for (let i = 0; i < 48; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <div className="flex items-top justify-between">
          <h2 className="text-base font-medium mb-4">向量数据库</h2>
          <Button type="link" onClick={handleAddVectorDB}>
            添加向量库
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {vectorDBs.map((db) => (
            <Card key={db.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{db.name}</span>
                  <Badge
                    status={
                      db.status === "connected"
                        ? "success"
                        : db.status === "error"
                        ? "error"
                        : "default"
                    }
                    text={
                      db.status === "connected"
                        ? "已连接"
                        : db.status === "error"
                        ? "异常"
                        : "未连接"
                    }
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Button icon={<ExperimentOutlined />} size="small" />
                  <Button icon={<EditOutlined />} size="small" />
                  <Button icon={<DeleteOutlined />} size="small" danger />
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>类型: {db.type}</p>
                <p>地址: {db.url}</p>
                <p>
                  维度: {db.dimension} | 距离度量: {db.metric}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Card>
      <Card>
        <div className="flex items-top justify-between">
          <h2 className="text-base font-medium mb-4">模型接入</h2>
          <Button type="link" onClick={handleAddModel}>
            添加模型
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {models.map((model) => (
            <Card key={model.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.name}</span>
                  <Badge
                    status={model.status === "active" ? "success" : "default"}
                    text={model.status === "active" ? "启用" : "禁用"}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    icon={
                      showApiKey[model.id] ? (
                        <EyeInvisibleOutlined />
                      ) : (
                        <EyeOutlined />
                      )
                    }
                    size="small"
                    onClick={() => toggleApiKeyVisibility(model.id)}
                  />
                  <Button icon={<ReloadOutlined />} size="small" />
                  <Button icon={<EditOutlined />} size="small" />
                  <Button icon={<DeleteOutlined />} size="small" danger />
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>提供商: {model.provider}</p>
                <p>模型: {model.model}</p>
                <div className="flex items-center gap-2">
                  <span>API Key:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {showApiKey[model.id] ? model.apiKey : "sk-****-****-****"}
                  </code>
                  <Button
                    icon={<CopyOutlined />}
                    size="small"
                    onClick={() => navigator.clipboard.writeText(model.apiKey)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span>使用率:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${model.usage}%` }}
                    />
                  </div>
                  <span className="text-xs">{model.usage}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
      {/* VectorDB Modal */}
      <Modal
        open={showVectorDBDialog}
        onCancel={() => setShowVectorDBDialog(false)}
        title="添加向量数据库"
        footer={[
          <Button key="cancel" onClick={() => setShowVectorDBDialog(false)}>
            取消
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={() => setShowVectorDBDialog(false)}
          >
            添加数据库
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item name="name" label="数据库名称">
            <Input placeholder="输入数据库名称" />
          </Form.Item>
          <Form.Item name="type" label="数据库类型">
            <Select options={dbOptions}></Select>
          </Form.Item>
          <Form.Item name="url" label="连接地址">
            <Input placeholder="https://your-index.svc.region.pinecone.io" />
          </Form.Item>
          <Form.Item name="apiKey" label="API Key">
            <Input type="password" placeholder="输入API密钥" />
          </Form.Item>
          <Form.Item name="dimension" label="向量维度">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="metric" label="距离度量">
            <Select options={metricOptions}></Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Model Modal */}
      <Modal
        open={showModelDialog}
        onCancel={() => setShowModelDialog(false)}
        title="添加AI模型"
        footer={[
          <Button key="cancel" onClick={() => setShowModelDialog(false)}>
            取消
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={() => setShowModelDialog(false)}
          >
            添加模型
          </Button>,
        ]}
      >
        <Form
          form={form}
          onValuesChange={(changedValues) => {
            setNewModel({ ...newModel, ...changedValues });
          }}
          layout="vertical"
        >
          <Form.Item name="name" label="模型名称">
            <Input placeholder="输入模型名称" />
          </Form.Item>
          <Form.Item name="provider" label="服务提供商">
            <Select options={providerOptions}></Select>
          </Form.Item>
          <Form.Item name="model" label="模型标识">
            <Input placeholder="gpt-4-turbo-preview" />
          </Form.Item>
          <Form.Item name="apiKey" label="API Key">
            <Input
              placeholder="输入或生成API密钥"
              addonAfter={
                <ReloadOutlined
                  onClick={() => {
                    form.setFieldsValue({ apiKey: generateApiKey() });
                    setNewModel({ ...newModel, apiKey: generateApiKey() });
                  }}
                />
              }
            />
          </Form.Item>
          {newModel.provider === "local" && (
            <Form.Item name="endpoint" label="自定义端点">
              <Input placeholder="http://localhost:8000/v1" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
