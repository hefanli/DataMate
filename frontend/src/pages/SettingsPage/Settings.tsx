import { useState } from "react";
import { Tabs } from "antd";
import {
  SettingOutlined,
  DatabaseOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import DevelopmentInProgress from "@/components/DevelopmentInProgress";
import WebhookConfig from "./components/WebhookConfig";
import EnvironmentAccess from "./components/EnvironmentAccess";
import SystemConfig from "./components/SystemConfig";

export default function SettingsPage() {
  return <DevelopmentInProgress />;
  const [activeTab, setActiveTab] = useState("system");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">系统设置</h1>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="space-y-6"
        items={[
          {
            key: "system",
            label: (
              <span>
                <SettingOutlined className="mr-1" />
                系统设置
              </span>
            ),
            children: <SystemConfig />,
          },
          {
            key: "environment",
            label: (
              <span>
                <DatabaseOutlined className="mr-1" />
                环境接入
              </span>
            ),
            children: <EnvironmentAccess />,
          },
          {
            key: "webhook",
            label: (
              <span>
                <ApiOutlined className="mr-1" />
                Webhook
              </span>
            ),
            children: <WebhookConfig />,
          },
        ]}
      />
    </div>
  );
}
