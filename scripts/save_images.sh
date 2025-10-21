#!/bin/bash

# ==========================================================
# 步骤 1: 定义帮助函数
# ==========================================================

# 脚本名称
SCRIPT_NAME=$(basename "$0")

help_message() {
    cat << EOF
Usage: $SCRIPT_NAME [-d TARGET_DIR] [-h|--help]

描述: 
  将预定义的 Docker 镜像列表保存为 .tar 文件。

选项:
  -d TARGET_DIR  指定保存镜像的目标目录。
                 (绝对路径或相对路径)
                 如果未指定，将使用默认路径: $TARGET_DIR_DEFAULT
  -h, --help     显示此帮助信息并退出。

示例:
  # 使用默认目录 (./dist)
  $SCRIPT_NAME

  # 指定保存到 /tmp/my-archive 目录
  $SCRIPT_NAME -d /tmp/my-archive
EOF
}

# ==========================================================
# 步骤 2: 定义默认值和处理参数
# ==========================================================

# 默认目标目录
TARGET_DIR_DEFAULT="./dist"
TARGET_DIR="$TARGET_DIR_DEFAULT"

# 使用 getopts 处理命令行选项。
# d: 表示 -d 选项后需要一个参数（目标目录）。
while getopts "d:h" opt; do
    case ${opt} in
        d )
            # 如果 -d 选项被指定，使用传入的参数作为目标目录
            TARGET_DIR="$OPTARG"
            ;;
        h )
            # 如果是 -h 选项，显示帮助并退出
            help_message
            exit 0
            ;;
        \? )
            # 处理无效的选项
            echo "错误：无效选项 -$OPTARG" >&2
            help_message
            exit 1
            ;;
    esac
done

# 移动到下一个非选项参数 (通常此脚本没有其他参数，但这是最佳实践)
shift $((OPTIND -1))


# ==========================================================
# 步骤 3: 脚本核心逻辑
# ==========================================================

# 检查/创建目标文件夹
if ! mkdir -p "$TARGET_DIR"; then
    echo "❌ 致命错误：无法创建目标目录: $TARGET_DIR" >&2
    exit 1
fi
echo "目标目录已确认/创建: $TARGET_DIR"
echo "----------------------------------------"

# Image list
images=("frontend:latest" "backend:latest" "runtime:latest" "mysql:8")

for image in "${images[@]}"; do

    # 清理镜像名称，用 '_' 替换 ':'，以创建安全的文件名。
    safe_name="${image//[:]/_}"
    
    # 构造完整的输出文件路径。
    output_path="$TARGET_DIR/$safe_name.tar"

    echo "正在保存镜像 $image"
    echo "  -> 到文件 $output_path"
    
    # 执行 docker save 命令
    docker save -o "$output_path" "$image"

    # 检查保存是否成功 ($? 存储上一个命令的退出状态)
    if [ $? -eq 0 ]; then
        echo "✅ 保存成功。"
    else
        echo "❌ 保存失败！"
    fi
    echo ""

done