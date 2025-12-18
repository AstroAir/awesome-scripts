# 贡献指南

感谢你有兴趣为本项目做出贡献！🎉

## 📋 行为准则

请保持友善、尊重他人，共同维护良好的社区氛围。

## 🐛 报告 Bug

提交 Issue 时请包含：

1. **脚本名称** - 哪个脚本出现问题
2. **浏览器信息** - 浏览器名称和版本
3. **油猴扩展** - 使用的扩展名称和版本
4. **问题描述** - 详细描述遇到的问题
5. **复现步骤** - 如何复现该问题
6. **期望行为** - 你期望的正确行为
7. **截图/日志** - 如有，请附上相关截图或控制台日志

## 💡 功能建议

欢迎提出新功能建议！请在 Issue 中说明：

- 功能描述
- 使用场景
- 可能的实现方案（可选）

## 🔧 提交代码

### 开发流程

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/your-feature`
3. 提交更改: `git commit -m 'feat: add some feature'`
4. 推送分支: `git push origin feature/your-feature`
5. 提交 Pull Request

### 代码规范

- 使用 2 空格缩进
- 使用有意义的变量和函数名
- 添加必要的注释
- 保持代码简洁易读

### Commit 规范

使用语义化的 commit message：

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 代码重构
- `perf:` 性能优化
- `test:` 测试相关
- `chore:` 构建/工具相关

### UserScript 规范

新增脚本时请确保包含完整的元数据块：

```javascript
// ==UserScript==
// @name         脚本名称
// @namespace    命名空间
// @version      版本号
// @description  脚本描述
// @author       作者
// @match        匹配的网站
// @grant        所需权限
// @license      MIT
// ==/UserScript==
```

## 📝 文档

修改脚本功能后，请同步更新 README.md 中的相关说明。

## ❓ 问题咨询

如有疑问，可以通过 Issue 进行讨论。

---

再次感谢你的贡献！🙏
