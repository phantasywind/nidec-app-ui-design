# 完整区域浏览器补验

2026-09-06。制品5f90a70c1e08724a2249f362cc0d29144f9350cc70f73b31148cd476b04573d6；consumer-retest-3构建；当前浏览器服务browser-4的应用资源SHA256与该复测一致。

## 实际视口

通过浏览器viewport能力设置，而非改变CSS容器宽度。高度均900px，Drawer medium宽592px。四个实际innerWidth与设置一致，document.scrollWidth相同，无文档横向溢出。Close顶部24px/底55.33px；Save locally与Cancel顶部844.67px/底876px，均位于视口内。

| 实际宽度 | Drawer左边 | Drawer右边 | 页面scrollWidth |
| --- | --- | --- | --- |
| 1440 | 848 | 1440 | 1440 |
| 1280 | 688 | 1280 | 1280 |
| 900 | 308 | 900 | 900 |
| 720 | 128 | 720 | 720 |

720×900截图在浏览器工具输出中，完整区域可见且没有箭头重叠。此结果仅覆盖共享示例，不挪用为CPQ真实宿主验收，也不是所有缩放比例或所有高度的保证。

## 宿主对照方式

后续探针从CPQ只读加载tokens/layout/components/pages/design-system五个现有CSS，保持该相对加载顺序，保存测试运行副本及哈希，不修改CPQ。共享fixture不假装已经应用CPQ适配层；直接置于真实宿主下用于定位必须处理的集成边界。负向差异不通过卸载样式或取消检查掩盖。

## 真实宿主负向与隔离验证

browser-5未加任何适配，实际Select命中两段旧渐变箭头，Input/Button命中旧min-height38px；该运行作为失败对照保留，不标为通过。

browser-6/7采用以下消费方测试方案（不是共享公共API，更未修改CPQ源）：

- 对Input.input、Textarea.textarea、Select.select、Checkbox.input使用现有`cpq-nidec-native-control`标记，复用CPQ已有零特异性排除规则。
- 仅在复制的components.css中用CSS解析器将类型选择器button改为`button:not(:where(.nidec-ui-button))`，排除共享Button已有标记。没有隐藏Fluent图标或加旧控件皮肤；也没有删除其他宿主CSS。02未来需以实际引用审查该选择器调整，不能把测试转换脚本整体移入生产。
- 原文件与转换后CSS分别保存，哈希在served-hashes.json。包内不包含CPQ样式或标记逻辑。

隔离后Select背景none且Fluent SVG1个、高32px；普通Input内部约30.67px且不再有38px最小高度；Button约31.33px（浏览器分数像素结果）不再受旧最小高度；Textarea仍按内容和Fluent自身min-height52px决定高度，并未统一强设控件高度。

宿主隔离四实际视口1440/1280/900/720、高900，scrollWidth依次1425/1265/885/705（宿主保留滚动条空间），均无横向溢出；保存按钮底边876px。首次1440截图计算处于过渡期，不用其左坐标判定稳定动画位置。各视口按钮可见及无横向溢出通过，不将布局全部像素声明为同默认示例一致。

## 交互和扫描

受控Name输入Host test后保存计数0→1；Cancel不增加计数。Read-only输入键a后仍Reference；Disabled原生disabled=true；四普通Input均有真实label关联，错误Input aria-invalid=true且aria-describedby指向validationMessage。Shift+Tab从Close回Cancel；正向Tab循环；Escape后Open editor获得焦点。确认对话框关闭返回Open confirmation。确认对话框aria-modal=true，背景Open editor中心实际命中DialogSurface遮罩而非按钮。

browser-7初始及动画结束后F8明确触发的稳定扫描均0违规。无名称按钮负向对照检出button-name，受限外连检出connect-src拦截。此前动画期间对比度告警保留，不用新结果抹去失败。自动扫描不等于完整WCAG合规或人工应用验收。

## CSP结论边界

consumer-retest-4使用显式RendererProvider/createDOMRenderer和响应nonce，browser-7正常页样式nonce匹配；严格模式不给nonce授权，样式规则总数为0且产生额外拦截，证明不是以unsafe-inline获得正常显示。正常页仍有此前空白页也能复现的环境style-src-elem inline135:93843签名；仅说明该签名不依赖Fluent，不声称全环境零报告或已查明浏览器注入实现。CPQ部署响应头/代理/nonce仍待应用环境核验。

## 仍不能冒充已完成的项目

当前覆盖是共享候选和“CPQ样式副本＋拟采用边界”的本地技术验证。尚未在CPQ改代码、未验证所有真实页面/未迁移旧控件的hover回归，也未执行用户真实输入法或独立应用验收。以上保留为接入验收要求，不宣布CPQ改造完成或旧体系退役。制品尚无新的发布版本，不允许发布/生产安装。
