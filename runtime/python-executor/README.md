# 自定义算子开发指南

## 算子规范

### 算子元数据格式

每个自定义算子都需要包含一个 `metadata.yml` 文件：

```yaml
name: '落盘算子'
name_en: 'save file operator'
description: '将文件内容保存为文件。'
description_en: 'Save the file data as a file.'
language: 'Python'
vendor: 'Huawei'
raw_id: 'FileExporter'
version: '1.0.0'
types:
  - 'collect'
modal: 'others'
effect:
  before: ''
  after: ''
inputs: 'all'
outputs: 'all'
```

### 算子实现

创建 `process.py` 文件：

```python
# -*- coding: utf-8 -*-

"""
Description: Json文本抽取
Create: 2024/06/06 15:43
"""
import time
from loguru import logger
from typing import Dict, Any

from datamate.core.base_op import Mapper


class TextFormatter(Mapper):
    """把输入的json文件流抽取为txt"""

    def __init__(self, *args, **kwargs):
        super(TextFormatter, self).__init__(*args, **kwargs)

    @staticmethod
    def _extract_json(byte_io):
        """将默认使用utf-8编码的Json文件流解码，抽取为txt"""
        # 用utf-8-sig的格式进行抽取，可以避免uft-8 BOM编码格式的文件在抽取后产生隐藏字符作为前缀。
        return byte_io.decode("utf-8-sig").replace("\r\n", "\n")

    def byte_read(self, sample: Dict[str, Any]):
        filepath = sample[self.filepath_key]
        with open(filepath, "rb") as file:
            byte_data = file.read()
        sample[self.data_key] = byte_data

    def execute(self, sample: Dict[str, Any]) -> Dict[str, Any]:
        start = time.time()
        try:
            self.byte_read(sample)
            sample[self.text_key] = self._extract_json(sample[self.data_key])
            sample[self.data_key] = b""  # 将sample[self.data_key]置空
            logger.info(
                f"fileName: {sample[self.filename_key]}, method: TextFormatter costs {(time.time() - start):6f} s")
        except UnicodeDecodeError as err:
            logger.exception(f"fileName: {sample[self.filename_key]}, method: TextFormatter causes decode error: {err}")
            raise
        return sample

```

创建 `__init__.py` 文件：

```python
# -*- coding: utf-8 -*-

from datamate.core.base_op import OPERATORS

OPERATORS.register_module(module_name='TextFormatter',
                          module_path="ops.formatter.text_formatter.process")

```