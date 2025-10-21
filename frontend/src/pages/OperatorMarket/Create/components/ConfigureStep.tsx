import { Alert, Input, Button } from "antd";
import { CheckCircle, Plus, TagIcon, X } from "lucide-react";
import { useState } from "react";

export default function ConfigureStep({ parsedInfo, parseError }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const availableTags = [
    "图像处理",
    "预处理",
    "缩放",
    "裁剪",
    "旋转",
    "文本处理",
    "分词",
    "中文",
    "NLP",
    "医学",
    "音频处理",
    "特征提取",
    "MFCC",
    "频谱分析",
    "视频处理",
    "帧提取",
    "关键帧",
    "采样",
    "多模态",
    "融合",
    "深度学习",
    "注意力机制",
    "推理加速",
    "TensorRT",
    "优化",
    "GPU",
    "数据增强",
    "几何变换",
    "颜色变换",
    "噪声",
  ];

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
      {/* 解析结果 */}
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <h2 className="text-xl font-bold text-gray-900">解析完成</h2>
      </div>

      {parseError && (
        <Alert
          message="解析过程中发现问题"
          description={parseError}
          type="warning"
          showIcon
          className="mb-6"
        />
      )}

      {parsedInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">基本信息</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  算子名称
                </label>
                <div className="p-2 bg-gray-50 rounded border text-gray-900">
                  {parsedInfo.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  版本
                </label>
                <div className="p-2 bg-gray-50 rounded border text-gray-900">
                  {parsedInfo.version}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  作者
                </label>
                <div className="p-2 bg-gray-50 rounded border text-gray-900">
                  {parsedInfo.author}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分类
                </label>
                <div className="p-2 bg-gray-50 rounded border text-gray-900">
                  {parsedInfo.category}
                </div>
              </div>
            </div>
          </div>

          {/* 技术规格 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">技术规格</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  框架
                </label>
                <div className="p-2 bg-gray-50 rounded border text-gray-900">
                  {parsedInfo.framework}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  语言
                </label>
                <div className="p-2 bg-gray-50 rounded border text-gray-900">
                  {parsedInfo.language}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  类型
                </label>
                <div className="p-2 bg-gray-50 rounded border text-gray-900">
                  {parsedInfo.type}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  模态
                </label>
                <div className="p-2 bg-gray-50 rounded border text-gray-900">
                  {parsedInfo.modality.join(", ")}
                </div>
              </div>
            </div>
          </div>

          {/* 描述 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <div className="p-3 bg-gray-50 rounded border text-gray-900">
              {parsedInfo.description}
            </div>
          </div>

          {/* 依赖项 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              依赖项
            </label>
            <div className="p-3 bg-gray-50 rounded border">
              <div className="space-y-1">
                {parsedInfo.dependencies.map((dep, index) => (
                  <div key={index} className="text-sm text-gray-900 font-mono">
                    {dep}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 性能指标 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              性能指标
            </label>
            <div className="p-3 bg-gray-50 rounded border space-y-2">
              {parsedInfo.performance.accuracy && (
                <div className="text-sm">
                  <span className="font-medium">准确率:</span>{" "}
                  {parsedInfo.performance.accuracy}%
                </div>
              )}
              <div className="text-sm">
                <span className="font-medium">速度:</span>{" "}
                {parsedInfo.performance.speed}
              </div>
              <div className="text-sm">
                <span className="font-medium">内存:</span>{" "}
                {parsedInfo.performance.memory}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 标签配置 */}
      {/* 预定义标签 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">推荐标签</h3>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (selectedTags.includes(tag)) {
                  handleRemoveTag(tag);
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-blue-100 text-blue-800 border-blue-200"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 自定义标签 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          添加自定义标签
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="输入自定义标签..."
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onPressEnter={handleAddCustomTag}
            className="flex-1"
          />
          <Button onClick={handleAddCustomTag} disabled={!customTag.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            添加
          </Button>
        </div>
      </div>

      {/* 已选标签 */}
      {selectedTags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            已选标签 ({selectedTags.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                <TagIcon className="w-3 h-3" />
                <span>{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
