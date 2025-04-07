# team-27-project

本项目目录下的 `html` 文件夹中包含最新的工作成果。请在浏览器（推荐统一用Chrome开发）中运行 `main.html` 来查看最新效果。

---

## 项目简介

详见 `Situation Puzzle Game Project Proposal.docx`

---

## 环境搭建与 Git 使用指南

### 1. 创建项目文件夹

首先在本地新建一个文件夹，用于存放项目文件。

### 2. 初始化 Git 仓库

在终端中进入项目文件夹后，执行以下命令：

```bash
git init
git remote add origin https://github.com/CS222-UIUC/team-27-project.git
```

> **检查远程仓库配置：**
>
> ```bash
> git remote -v
> ```

### 3. 更新最新代码

在提交本地更改前，请先拉取远程仓库中的最新代码，并查看更新日志：

```bash
git pull origin main
```

同时建议查看 `log.txt`，了解详细的更新信息。

### 4. 提交与上传代码

完成代码修改后，按以下步骤提交和上传代码：

1. **添加改动到暂存区：**

- 添加所有改动：
    ```bash
    git add .
    ```
- 或者仅添加指定文件（例如 `chat.js`）：
    ```bash
    git add chat.js
    ```

2. **提交改动：**

```bash
git commit -m "任何你想说明的提交信息"
```

3. **推送到远程仓库：**

```bash
git push origin main
```

> **注意：**  
> 本项目使用的主分支名称为 `main`（非 `master`）。

---

## 注意事项

- **谨慎使用 `git add .`：**  
若不确定提交内容，建议逐个文件添加，以避免误提交不希望修改的文件。

- 如有问题或疑问，可咨询 ChatGPT 或查阅相关 Git 文档。

---

## 其他说明

如果你想要补充README.md，推荐使用chatGPT统一格式。

哇噻
