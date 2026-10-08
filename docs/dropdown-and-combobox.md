# Dropdown 与 Combobox

宽度由使用场景的布局明确控制，不由共享 Dropdown 强制占满页面。显示密度等短选项字段使用有界宽度（预览为 `width: 16rem; max-width: 100%; min-width: 0; justify-self: start`）；表单字段可填满所在字段列，不应直接铺满整个页面。复制示例时需同时保留字段布局，检查父级 Grid/Flex 的默认拉伸。此宽度不是公共组件默认值。

普通下拉使用 `Dropdown`，可搜索下拉使用 `Combobox`。两者与 `Option` 均从共享包主入口导入。此规则对应 `0.1.0`；安装前核对[发布状态](releases/0.1.0.md)，rc.4 不包含该新增 Dropdown 出口。

- Dropdown：固定集合中选择，保留下拉箭头，不能输入自由文本。
- Combobox：允许输入以匹配选项；搜索场景左侧展示放大镜，右侧保留下拉箭头。查询、过滤、已选值与远程加载由应用控制，不能仅修改 placeholder 宣称实现搜索。
- 无结果时给出不可选的“无匹配结果”；禁用状态不能被点击选中。输入不等于选择，清除或修改查询后应明确处理旧选中值。
- 普通单选使用白色列表面板、浅绿悬停、浅绿选中、深绿文字与勾选标记。焦点轮廓来自绿色主题；强制颜色模式遵循系统可访问配色。
- 使用共享 `Option` 保证样式随组件进入 portal；不要用应用全局 option CSS 或修改全部中性色 token 来模拟选项状态。

`Select` 仍作为兼容出口保留，不再推荐用于要求统一外观的新页面。原生弹出菜单受系统和浏览器控制，不能承诺跨平台绿色高亮一致。

迁移时将原生 `<option>` 改为 `Option`，`onChange` 改为 `onOptionSelect`，通过 `data.optionValue` / `data.selectedOptions` 读取选择。使用 `selectedOptions` / `defaultSelectedOptions` 表达选项键；`value` 表示展示文本，不能把内部 ID 当显示名称。与 HTML 表单提交结合时由应用把选中键纳入提交数据。

参考预览 `?view=select` 的实际代码、[组件目录](component-catalog.md)和[接入指南](consumer-ui-adoption.md)。输入、方向键、Enter、Escape、失焦、空结果和弹层选中颜色都应在真实应用复核。
