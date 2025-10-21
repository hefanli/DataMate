import { Upload, type UploadFile } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import type { Dataset } from "@/pages/DataManagement/dataset.model";
import { sliceFile } from "@/utils/file.util";

const { Dragger } = Upload;

export const useImportFile = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileSliceList = useMemo(() => {
    const sliceList = fileList.map((file) => {
      const slices = sliceFile(file);
      return { originFile: file, slices, name: file.name, size: file.size };
    });
    return sliceList;
  }, [fileList]);

  const resetFiles = () => {
    setFileList([]);
  };

  const handleUpload = async (dataset: Dataset) => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file);
    });
    window.dispatchEvent(
      new CustomEvent("upload:dataset", {
        detail: { dataset, files: fileSliceList },
      })
    );
    resetFiles();
  };

  const handleBeforeUpload = (_, files: UploadFile[]) => {
    setFileList([...fileList, ...files]);
    return false;
  };

  const handleRemoveFile = (file: UploadFile) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const importFileRender = () => (
    <Dragger
      className="w-full"
      onRemove={handleRemoveFile}
      beforeUpload={handleBeforeUpload}
      multiple
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">本地文件上传</p>
      <p className="ant-upload-hint">拖拽文件到此处或点击选择文件</p>
    </Dragger>
  );

  return { fileList, resetFiles, handleUpload, importFileRender };
};
