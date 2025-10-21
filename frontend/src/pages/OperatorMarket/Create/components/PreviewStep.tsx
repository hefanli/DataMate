import { Button } from "antd";
import { CheckCircle, Plus, Eye } from "lucide-react";

export default function PreviewStep({ setUploadStep }) {
  return (
    <div className="text-center py-2">
      <div className="w-24 h-24 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">发布成功！</h2>
      <p className="text-gray-600 mb-8">您的算子已成功发布到算子市场</p>

      <div className="flex justify-center gap-4">
        <Button onClick={() => setUploadStep("upload")}>
          <Plus className="w-4 h-4 mr-2" />
          继续上传
        </Button>
        <Button type="primary">
          <Eye className="w-4 h-4 mr-2" />
          查看算子
        </Button>
      </div>
    </div>
  );
}
