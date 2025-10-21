import { StickyNote } from "lucide-react";
import { AnnotationTask, AnnotationTaskStatus } from "./annotation.model";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

export const AnnotationTaskStatusMap = {
  [AnnotationTaskStatus.ACTIVE]: {
    label: "活跃",
    value: AnnotationTaskStatus.ACTIVE,
    color: "#409f17ff",
    icon: <CheckCircleOutlined />,
  },
  [AnnotationTaskStatus.PROCESSING]: {
    label: "处理中",
    value: AnnotationTaskStatus.PROCESSING,
    color: "#2673e5",
    icon: <ClockCircleOutlined />,
  },
  [AnnotationTaskStatus.INACTIVE]: {
    label: "未激活",
    value: AnnotationTaskStatus.INACTIVE,
    color: "#4f4444ff",
    icon: <CloseCircleOutlined />,
  },
};

export function mapAnnotationTask(task: AnnotationTask) {
  return {
    ...task,
    id: task.mapping_id,
    projId: task.labelling_project_id,
    name: task.labelling_project_name,
    createdAt: task.created_at,
    updatedAt: task.last_updated_at,
    icon: <StickyNote />,
    iconColor: "bg-blue-100",
    status: {
      label:
        task.status === "completed"
          ? "已完成"
          : task.status === "in_progress"
          ? "进行中"
          : task.status === "skipped"
          ? "已跳过"
          : "待开始",
      color: "bg-blue-100",
    },
  };
}
