# Complete-region consumer source

此目录是React/Vite消费者源码，不是可用 `file://` 打开的静态网页。`index.html` 中的 `/src/main.tsx` 需要构建处理；不要把该文件链接当作交付预览。

本轮运行消费者位于共享仓库 `.tmp/fluent-complete-region-1/consumer-node22/react-complete-region-consumer/`，由资格脚本安装真实tgz后类型检查和构建；不要为打开示例添加源码alias或直接引用共享src。

消费者构建成功后，在该运行目录使用Node22与本地Vite执行 `vite preview --host 127.0.0.1 --port 5190 --strictPort`，实际地址以成功启动输出为准；源码文件存在不代表服务已启动。停止预览只停止该预览进程，不影响CPQ服务。

此预览仅有页面本地状态，不连接业务API、认证或持久化，不代表独立应用或生产CSP验收。预览验证必须确认HTTP成功且浏览器加载主要控件，不能只用HTTP200冒充页面可用。
