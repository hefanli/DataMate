import {
  DatasetType,
  DatasetStatus,
  type Dataset,
  DatasetSubType,
  DataSource,
} from "@/pages/DataManagement/dataset.model";
import { formatBytes, formatDateTime } from "@/utils/unit";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { AnyObject } from "antd/es/_util/type";
import {
  FileImage,
  FileText,
  Video,
  FileCode,
  MessageCircleMore,
  ImagePlus,
  FileMusic,
  Music,
  Videotape,
  Database,
  Image,
  ScanText,
} from "lucide-react";

export const datasetTypeMap: Record<
  string,
  {
    value: DatasetType;
    label: string;
    order: number;
    description: string;
    icon?: any;
    iconColor?: string;
    children: DatasetSubType[];
  }
> = {
  [DatasetType.TEXT]: {
    value: DatasetType.TEXT,
    label: "文本",
    order: 1,
    icon: ScanText,
    iconColor: "blue",
    children: [
      DatasetSubType.TEXT_DOCUMENT,
      DatasetSubType.TEXT_WEB,
      DatasetSubType.TEXT_DIALOG,
    ],
    description: "用于处理和分析文本数据的数据集",
  },
  [DatasetType.IMAGE]: {
    value: DatasetType.IMAGE,
    label: "图像",
    order: 2,
    icon: Image,
    iconColor: "green",
    children: [DatasetSubType.IMAGE_IMAGE, DatasetSubType.IMAGE_CAPTION],
    description: "用于处理和分析图像数据的数据集",
  },
  [DatasetType.AUDIO]: {
    value: DatasetType.AUDIO,
    label: "音频",
    order: 3,
    icon: Music,
    iconColor: "orange",
    children: [DatasetSubType.AUDIO_AUDIO, DatasetSubType.AUDIO_JSONL],
    description: "用于处理和分析音频数据的数据集",
  },
  [DatasetType.VIDEO]: {
    value: DatasetType.VIDEO,
    label: "视频",
    order: 3,
    icon: Video,
    iconColor: "purple",
    children: [DatasetSubType.VIDEO_VIDEO, DatasetSubType.VIDEO_JSONL],
    description: "用于处理和分析视频数据的数据集",
  },
};

export const datasetSubTypeMap: Record<
  string,
  {
    value: DatasetSubType;
    label: string;
    order?: number;
    description?: string;
    icon?: any;
    color?: string;
  }
> = {
  [DatasetSubType.TEXT_DOCUMENT]: {
    value: DatasetSubType.TEXT_DOCUMENT,
    label: "文档",
    color: "blue",
    icon: FileText,
    description: "用于存储和处理各种文档格式的文本数据集",
  },
  [DatasetSubType.TEXT_WEB]: {
    value: DatasetSubType.TEXT_WEB,
    label: "网页",
    color: "cyan",
    icon: FileCode,
    description: "用于存储和处理网页数据集",
  },
  [DatasetSubType.TEXT_DIALOG]: {
    value: DatasetSubType.TEXT_DIALOG,
    label: "对话",
    color: "teal",
    icon: MessageCircleMore,
    description: "用于存储和处理对话数据的数据集",
  },
  [DatasetSubType.IMAGE_IMAGE]: {
    value: DatasetSubType.IMAGE_IMAGE,
    label: "图像",
    color: "green",
    icon: FileImage,
    description: "用于大规模图像预训练模型的数据集",
  },
  [DatasetSubType.IMAGE_CAPTION]: {
    value: DatasetSubType.IMAGE_CAPTION,
    label: "图像+caption",
    color: "lightgreen",
    icon: ImagePlus,
    description: "用于图像标题生成的数据集",
  },
  [DatasetSubType.AUDIO_AUDIO]: {
    value: DatasetSubType.AUDIO_AUDIO,
    label: "音频",
    color: "purple",
    icon: Music,
    description: "用于大规模音频预训练模型的数据集",
  },
  [DatasetSubType.AUDIO_JSONL]: {
    value: DatasetSubType.AUDIO_JSONL,
    label: "音频+JSONL",
    color: "purple",
    icon: FileMusic,
    description: "用于大规模音频预训练模型的数据集",
  },
  [DatasetSubType.VIDEO_VIDEO]: {
    value: DatasetSubType.VIDEO_VIDEO,
    label: "视频",
    color: "orange",
    icon: Video,
    description: "用于大规模视频预训练模型的数据集",
  },
  [DatasetSubType.VIDEO_JSONL]: {
    value: DatasetSubType.VIDEO_JSONL,
    label: "视频+JSONL",
    color: "orange",
    icon: Videotape,
    description: "用于大规模视频预训练模型的数据集",
  },
};

export const datasetStatusMap = {
  [DatasetStatus.ACTIVE]: {
    label: "活跃",
    value: DatasetStatus.ACTIVE,
    color: "#409f17ff",
    icon: <CheckCircleOutlined />,
  },
  [DatasetStatus.PROCESSING]: {
    label: "处理中",
    value: DatasetStatus.PROCESSING,
    color: "#2673e5",
    icon: <ClockCircleOutlined />,
  },
  [DatasetStatus.INACTIVE]: {
    label: "未激活",
    value: DatasetStatus.INACTIVE,
    color: "#4f4444ff",
    icon: <CloseCircleOutlined />,
  },
  [DatasetStatus.DRAFT]: {
    label: "草稿",
    value: DatasetStatus.DRAFT,
    color: "#a1a1a1ff",
    icon: <FileOutlined />,
  },
};

export const dataSourceMap: Record<string, { label: string; value: string }> = {
  [DataSource.UPLOAD]: { label: "本地上传", value: DataSource.UPLOAD },
  // [DataSource.COLLECTION]: { label: "本地归集 ", value: DataSource.COLLECTION },
  // [DataSource.DATABASE]: { label: "数据库导入", value: DataSource.DATABASE },
  // [DataSource.NAS]: { label: "NAS导入", value: DataSource.NAS },
  // [DataSource.OBS]: { label: "OBS导入", value: DataSource.OBS },
};

export const dataSourceOptions = Object.values(dataSourceMap);

export function mapDataset(dataset: AnyObject): Dataset {
  const { icon: IconComponent, iconColor } =
    datasetTypeMap[dataset?.datasetType] || {};
  return {
    ...dataset,
    key: dataset.id,
    type: datasetTypeMap[dataset.datasetType]?.label || "未知",
    size: formatBytes(dataset.totalSize || 0),
    createdAt: formatDateTime(dataset.createdAt) || "--",
    updatedAt: formatDateTime(dataset?.updatedAt) || "--",
    icon: IconComponent ? (
      <IconComponent
        className="w-5 h-5 text-gray-500"
        // style={{ color: iconColor }}
      />
    ) : (
      <Database />
    ),
    status: datasetStatusMap[dataset.status],
    statistics: [
      { label: "文件数", value: dataset.fileCount || 0 },
      { label: "大小", value: formatBytes(dataset.totalSize || 0) },
    ],
    lastModified: dataset.updatedAt,
  };
}

export const datasetTypes = Object.values(datasetTypeMap).map((type) => ({
  ...type,
  options: type.children?.map(
    (subType) => datasetSubTypeMap[subType as keyof typeof datasetSubTypeMap]
  ),
}));
