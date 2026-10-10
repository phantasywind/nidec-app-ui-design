# Dropdown 与 Combobox

宽度由使用场景的布局明确控制，不由共享 Dropdown 强制占满页面。显示密度等短选项字段使用有界宽度（预览为 `width: 16rem; max-width: 100%; min-width: 0; justify-self: start`）；表单字段可填满所在字段列，不应直接铺满整个页面。复制示例时需同时保留字段布局，检查父级 Grid/Flex 的默认拉伸。此宽度不是公共组件默认值。

普通下拉使用 `Dropdown`，可搜索下拉使用 `Combobox`。两者与 `Option` 均从共享包主入口导入。此规则对应 `0.1.0`；安装前核对[发布状态](releases/0.1.0.md)，rc.4 不包含该新增 Dropdown 出口。

- Dropdown：固定集合中选择，保留下拉箭头，不能输入自由文本。
- Combobox：允许输入以匹配选项；搜索场景左侧展示放大镜，右侧保留下拉箭头。查询、过滤、已选值与远程加载由应用控制，不能仅修改 placeholder 宣称实现搜索。
- 无结果时给出不可选的“无匹配结果”；禁用状态不能被点击选中。输入不等于选择，清除或修改查询后应明确处理旧选中值。
- 普通单选使用白色列表面板、浅绿悬停、浅绿选中、深绿文字与勾选标记。焦点轮廓来自绿色主题；强制颜色模式遵循系统可访问配色。
- 使用共享 `Option` 保证样式随组件进入 portal；不要用应用全局 option CSS 或修改全部中性色 token 来模拟选项状态。

## 多选：MultiSelectDropdown

从固定短列表中选择多个值时使用 `MultiSelectDropdown`（主入口导入，尚未发布，随下一个版本提供）。它是 Fluent `Dropdown` 的 `multiselect` 模式，选项使用共享 `Option`，触发框以标签显示已选值。

- 选项通过 `options`（`{ value, text, disabled? }` 数组）传入，不接受子元素；`value` 为唯一键，`text` 为显示名称。重复或空值、以及不在 `options` 中的已选键都会直接报错。
- `selectedOptions` / `defaultSelectedOptions` 表达选中键；`onOptionSelect` 中 `data.selectedOptions` 为完整选择，`data.optionValue` 为本次切换的键。
- 弹层在勾选时保持打开，每个选项带复选标记；悬停为共享中性灰，选中为浅绿底、深绿文字。Fluent 多选选项以 `aria-checked` 而非 `aria-selected` 标记，共享 `Option` 对两者使用相同的选中色，`Combobox` 多选同样适用。
- 触发框按 `options` 顺序显示 `brand` 外观、extra-small 尺寸的标签；超过 `maxVisibleTags`（默认 2）的部分折叠为一个计数标签，文字由 `formatOverflowText` 决定（默认 `+N`）。标签不是按钮，取消选择在列表中取消勾选；读屏读出完整的逗号分隔列表。
- small 尺寸下标签（20px）高于文字行（16px），组件以 −2px 纵向外边距保持控件高度不变。这是唯一的尺寸例外，目的为保持 small 控件高度，仅作用于触发框内的标签行。
- 多选模式不支持 `clearable`；需要一次清空时由应用提供单独操作。可搜索的长列表多选使用 `Combobox` 的 `multiselect`；需要同时看到全部选项时使用 Checkbox。
- 哪些键有效、数量上限、默认值和提交内容由应用决定。

`Select` 仍作为兼容出口保留，不再推荐用于要求统一外观的新页面。原生弹出菜单受系统和浏览器控制，不能承诺跨平台绿色高亮一致。

迁移时将原生 `<option>` 改为 `Option`，`onChange` 改为 `onOptionSelect`，通过 `data.optionValue` / `data.selectedOptions` 读取选择。使用 `selectedOptions` / `defaultSelectedOptions` 表达选项键；`value` 表示展示文本，不能把内部 ID 当显示名称。与 HTML 表单提交结合时由应用把选中键纳入提交数据。

参考预览 `?view=select` 的实际代码、[组件目录](component-catalog.md)和[接入指南](consumer-ui-adoption.md)。输入、方向键、Enter、Escape、失焦、空结果和弹层选中颜色都应在真实应用复核。
