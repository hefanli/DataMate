import { TaskItem } from "@/pages/DataManagement/dataset.model";
import { calculateSHA256, checkIsFilesExist } from "@/utils/file.util";
import { App } from "antd";
import { useRef, useState } from "react";

export function useFileSliceUpload(
  {
    preUpload,
    uploadChunk,
    cancelUpload,
  }: {
    preUpload: (id: string, params: any) => Promise<{ data: number }>;
    uploadChunk: (id: string, formData: FormData, config: any) => Promise<any>;
    cancelUpload: ((reqId: number) => Promise<any>) | null;
  },
  showTaskCenter = true // 上传时是否显示任务中心
) {
  const { message } = App.useApp();
  const [taskList, setTaskList] = useState<TaskItem[]>([]);
  const taskListRef = useRef<TaskItem[]>([]); // 用于固定任务顺序

  const createTask = (detail: any = {}) => {
    const { dataset } = detail;
    const title = `上传数据集: ${dataset.name} `;
    const controller = new AbortController();
    const task: TaskItem = {
      key: dataset.id,
      title,
      percent: 0,
      reqId: -1,
      controller,
      size: 0,
      updateEvent: detail.updateEvent,
    };
    taskListRef.current = [task, ...taskListRef.current];

    setTaskList(taskListRef.current);
    return task;
  };

  const updateTaskList = (task: TaskItem) => {
    taskListRef.current = taskListRef.current.map((item) =>
      item.key === task.key ? task : item
    );
    setTaskList(taskListRef.current);
  };

  const removeTask = (task: TaskItem) => {
    const { key } = task;
    taskListRef.current = taskListRef.current.filter(
      (item) => item.key !== key
    );
    setTaskList(taskListRef.current);
    if (task.isCancel && task.cancelFn) {
      task.cancelFn();
    }
    if (task.updateEvent) window.dispatchEvent(new Event(task.updateEvent));
    if (showTaskCenter) {
      window.dispatchEvent(
        new CustomEvent("show:task-popover", { detail: { show: false } })
      );
    }
  };

  async function buildFormData({ file, reqId, i, j }) {
    const formData = new FormData();
    const { slices, name, size } = file;
    const checkSum = await calculateSHA256(slices[j]);
    formData.append("file", slices[j]);
    formData.append("reqId", reqId.toString());
    formData.append("fileNo", (i + 1).toString());
    formData.append("chunkNo", (j + 1).toString());
    formData.append("fileName", name);
    formData.append("fileSize", size.toString());
    formData.append("totalChunkNum", slices.length.toString());
    formData.append("checkSumHex", checkSum);
    return formData;
  }

  async function uploadSlice(task: TaskItem, fileInfo) {
    if (!task) {
      return;
    }
    const { reqId, key } = task;
    const { loaded, i, j, files, totalSize } = fileInfo;
    const formData = await buildFormData({
      file: files[i],
      i,
      j,
      reqId,
    });

    let newTask = { ...task };
    await uploadChunk(key, formData, {
      onUploadProgress: (e) => {
        const loadedSize = loaded + e.loaded;
        const curPercent = Number((loadedSize / totalSize) * 100).toFixed(2);

        newTask = {
          ...newTask,
          ...taskListRef.current.find((item) => item.key === key),
          size: loadedSize,
          percent: curPercent >= 100 ? 99.99 : curPercent,
        };
        updateTaskList(newTask);
      },
    });
  }

  async function uploadFile({ task, files, totalSize }) {
    const { data: reqId } = await preUpload(task.key, {
      totalFileNum: files.length,
      totalSize,
      datasetId: task.key,
    });

    const newTask: TaskItem = {
      ...task,
      reqId,
      isCancel: false,
      cancelFn: () => {
        task.controller.abort();
        cancelUpload?.(reqId);
        if (task.updateEvent) window.dispatchEvent(new Event(task.updateEvent));
      },
    };
    updateTaskList(newTask);
    if (showTaskCenter) {
      window.dispatchEvent(
        new CustomEvent("show:task-popover", { detail: { show: true } })
      );
    }
    // // 更新数据状态
    if (task.updateEvent) window.dispatchEvent(new Event(task.updateEvent));

    let loaded = 0;
    for (let i = 0; i < files.length; i++) {
      const { slices } = files[i];
      for (let j = 0; j < slices.length; j++) {
        await uploadSlice(newTask, {
          loaded,
          i,
          j,
          files,
          totalSize,
        });
        loaded += slices[j].size;
      }
    }
    removeTask(newTask);
  }

  const handleUpload = async ({ task, files }) => {
    const isErrorFile = await checkIsFilesExist(files);
    if (isErrorFile) {
      message.error("文件被修改或删除，请重新选择文件上传");
      removeTask({
        ...task,
        isCancel: false,
        ...taskListRef.current.find((item) => item.key === task.key),
      });
      return;
    }

    try {
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      await uploadFile({ task, files, totalSize });
    } catch (err) {
      console.error(err);
      message.error("文件上传失败，请稍后重试");
      removeTask({
        ...task,
        isCancel: true,
        ...taskListRef.current.find((item) => item.key === task.key),
      });
    }
  };

  return {
    taskList,
    createTask,
    removeTask,
    handleUpload,
  };
}
