import { Card, Button, Statistic, Table, Tooltip, Tag, App } from "antd";
import {
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TagManager from "@/components/TagManagement";
import { Link, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { SearchControls } from "@/components/SearchControls";
import CardView from "@/components/CardView";
import type { Dataset } from "@/pages/DataManagement/dataset.model";
import { datasetStatusMap, datasetTypeMap, mapDataset } from "../dataset.const";
import useFetchData from "@/hooks/useFetchData";
import {
  downloadDatasetUsingGet,
  getDatasetStatisticsUsingGet,
  queryDatasetsUsingGet,
  deleteDatasetByIdUsingDelete,
  createDatasetTagUsingPost,
  queryDatasetTagsUsingGet,
  deleteDatasetTagUsingDelete,
  updateDatasetTagUsingPut,
} from "../dataset.api";
import { formatBytes } from "@/utils/unit";
import EditDataset from "../Create/EditDataset";
import ImportConfiguration from "../Detail/components/ImportConfiguration";

export default function DatasetManagementPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [editDatasetOpen, setEditDatasetOpen] = useState(false);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [statisticsData, setStatisticsData] = useState<any>({
    count: {},
    size: {},
  });

  async function fetchStatistics() {
    const { data } = await getDatasetStatisticsUsingGet();

    const statistics = {
      size: [
        {
          title: "数据集总数",
          value: data?.totalDatasets || 0,
        },
        {
          title: "文件总数",
          value: data?.totalFiles || 0,
        },
        {
          title: "总大小",
          value: formatBytes(data?.totalSize) || '0 B',
        },
      ],
      count: [
        {
          title: "文本",
          value: data?.count?.text || 0,
        },
        {
          title: "图像",
          value: data?.count?.image || 0,
        },
        {
          title: "音频",
          value: data?.count?.audio || 0,
        },
        {
          title: "视频",
          value: data?.count?.video || 0,
        },
      ],
    };
    setStatisticsData(statistics);
  }

  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await queryDatasetTagsUsingGet();
      setTags(data.map((tag) => tag.name));
    };
    fetchTags();
  }, []);

  const filterOptions = useMemo(
    () => [
      {
        key: "type",
        label: "类型",
        options: [...Object.values(datasetTypeMap)],
      },
      {
        key: "status",
        label: "状态",
        options: [...Object.values(datasetStatusMap)],
      },
      {
        key: "tags",
        label: "标签",
        mode: "multiple",
        options: tags.map((tag) => ({ label: tag, value: tag })),
      },
    ],
    [tags]
  );

  const {
    loading,
    tableData,
    searchParams,
    pagination,
    fetchData,
    setSearchParams,
    handleFiltersChange,
  } = useFetchData<Dataset>(
    queryDatasetsUsingGet,
    mapDataset,
    30000, // 30秒轮询间隔
    true, // 自动刷新
    [fetchStatistics], // 额外的轮询函数
    0
  );

  const handleDownloadDataset = async (dataset: Dataset) => {
    await downloadDatasetUsingGet(dataset.id, dataset.name);
    message.success("数据集下载成功");
  };

  const handleDeleteDataset = async (id: number) => {
    if (!id) return;
    await deleteDatasetByIdUsingDelete(id);
    fetchData({ pageOffset: 0 });
    message.success("数据删除成功");
  };

  const handleImportData = (dataset: Dataset) => {
    setCurrentDataset(dataset);
    setShowUploadDialog(true);
  };

  const handleRefresh = async (showMessage = true) => {
    await fetchData({ pageOffset: 0 });
    if (showMessage) {
      message.success("数据已刷新");
    }
  };

  const operations = [
    {
      key: "edit",
      label: "编辑",
      icon: <EditOutlined />,
      onClick: (item: Dataset) => {
        setCurrentDataset(item);
        setEditDatasetOpen(true);
      },
    },
    {
      key: "import",
      label: "导入",
      icon: <UploadOutlined />,
      onClick: (item: Dataset) => {
        handleImportData(item);
      },
    },
    {
      key: "download",
      label: "下载",
      icon: <DownloadOutlined />,
      onClick: (item: Dataset) => {
        if (!item.id) return;
        handleDownloadDataset(item);
      },
    },
    {
      key: "delete",
      label: "删除",
      danger: true,
      confirm: {
        title: "确认删除该数据集？",
        description: "删除后该数据集将无法恢复，请谨慎操作。",
        okText: "删除",
        cancelText: "取消",
        okType: "danger",
      },
      icon: <DeleteOutlined />,
      onClick: (item: Dataset) => handleDeleteDataset(item.id),
    },
  ];

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      render: (name, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/data/management/detail/${record.id}`)}
        >
          {name}
        </Button>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 100,
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      width: 120,
    },
    {
      title: "文件数",
      dataIndex: "fileCount",
      key: "fileCount",
      width: 100,
    },
    {
      title: "创建者",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 120,
    },
    {
      title: "存储路径",
      dataIndex: "targetLocation",
      key: "targetLocation",
      width: 200,
      ellipsis: true,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      width: 200,
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: any) => {
        return (
          <Tag icon={status?.icon} color={status?.color}>
            {status?.label}
          </Tag>
        );
      },
      width: 120,
    },
    {
      title: "操作",
      key: "actions",
      width: 200,
      fixed: "right",
      render: (_: any, record: Dataset) => (
        <div className="flex items-center gap-2">
          {operations.map((op) => (
            <Tooltip key={op.key} title={op.label}>
              <Button
                type="text"
                icon={op.icon}
                onClick={() => op.onClick(record)}
              />
            </Tooltip>
          ))}
        </div>
      ),
    },
  ];

  const renderCardView = () => (
    <CardView
      loading={loading}
      data={tableData}
      pageSize={9}
      operations={operations}
      pagination={pagination}
      onView={(dataset) => {
        navigate("/data/management/detail/" + dataset.id);
      }}
    />
  );

  const renderListView = () => (
    <Card>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={pagination}
        rowKey="id"
        scroll={{ x: "max-content", y: "calc(100vh - 30rem)" }}
      />
    </Card>
  );

  useEffect(() => {
    const refresh = () => {
      handleRefresh(true);
    };
    window.addEventListener("update:datasets", refresh);
    return () => {
      window.removeEventListener("update:datasets", refresh);
    };
  }, []);

  return (
    <div className="gap-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">数据管理</h1>
        <div className="flex gap-2 items-center">
          {/* tasks */}
          <TagManager
            onCreate={createDatasetTagUsingPost}
            onDelete={(ids: string) => deleteDatasetTagUsingDelete({ ids })}
            onUpdate={updateDatasetTagUsingPut}
            onFetch={queryDatasetTagsUsingGet}
          />
          <Link to="/data/management/create">
            <Button
              type="primary"
              icon={<PlusOutlined className="w-4 h-4 mr-2" />}
            >
              创建数据集
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <div className="grid grid-cols-3">
            {statisticsData.size?.map?.((item) => (
              <Statistic
                title={item.title}
                key={item.title}
                value={`${item.value}`}
              />
            ))}
          </div>
        </Card>
      </div>
      <SearchControls
        searchTerm={searchParams.keyword}
        onSearchChange={(keyword) =>
          setSearchParams({ ...searchParams, keyword })
        }
        searchPlaceholder="搜索数据集名称、描述或标签..."
        filters={filterOptions}
        onFiltersChange={handleFiltersChange}
        onClearFilters={() => setSearchParams({ ...searchParams, filter: {} })}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle
        onReload={handleRefresh}
      />
      {viewMode === "card" ? renderCardView() : renderListView()}
      <EditDataset
        open={editDatasetOpen}
        data={currentDataset}
        onClose={() => {
          setCurrentDataset(null);
          setEditDatasetOpen(false);
        }}
        onRefresh={handleRefresh}
      />
      <ImportConfiguration
        data={currentDataset}
        open={showUploadDialog}
        onClose={() => {
          setCurrentDataset(null);
          setShowUploadDialog(false);
        }}
        updateEvent="update:datasets"
      />
    </div>
  );
}
