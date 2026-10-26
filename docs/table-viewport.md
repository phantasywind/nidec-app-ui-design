# 表格视口、冻结列与单元格写法

适用于普通 `Table` / `DataGrid`、Grouped Table 和矩阵表。可编辑表（`EditableGrid`、`LiteEditableGrid`）的视口、行高和行编辑见 [Editable Grid](editable-grid.md)（2026-10-26 定案）。

## 表格规则（EPM 与 CPQ 共同遵守）

- **一列一个字段。** 一个单元格只放一个字段，不在格内上下叠放或拼接两个字段（编号 + 名称、数量 + 单位、A · B）。确需例外的，由应用的负责人逐页批准并记在应用侧；包里不记录应用的例外。`RecordIdentityCellLayout` 的 `secondary` 已废弃。
- **一行一个行高。** 密集表格里的长文字单行省略，悬停看全文，用 `TruncatedText`，不要各页自写 `oneLine` 样式。
- **徽标不换行。** 包内 `Badge` 默认不换行；放徽标的列按最长状态名给宽度。
- **数字列右对齐。** 表头和数值一起右对齐，数字用等宽数字：表头单元格和数据单元格都加 `numericColumnClassName`。
- **宽表的横向滚动条始终够得到。** 用 `TableScrollRegion pinnedScrollbar`，不要各自写同步滚动条。
- **长表固定高度、表头固定。** 用 `TableScrollRegion maxHeight`。

## TableScrollRegion

```tsx
<TableScrollRegion aria-label="Selection matrix" maxHeight="calc(100vh - 14rem)" frozenColumns={3} pinnedScrollbar>
  <Table>…</Table>
</TableScrollRegion>
```

| 属性 | 作用 |
| --- | --- |
| （默认） | 只横向滚动，竖向不出第二条滚动条；可用键盘聚焦后滚动。 |
| `pinnedScrollbar` | 横向滚动条吸附在窗口底部：表格只要还有一部分在屏幕上，就能直接拖动，不必先滚到最后一行。内容不溢出时不显示。替代 EPM `TableScroll` 与 CPQ `ScrollTable`。 |
| `maxHeight` | 表格成为固定高度的视口：行在里面竖向滚动，表头一行固定。传 px 数字或任意 CSS 长度。长表的高度推荐跟窗口走：`calc(100vh - 页头与工具栏高度)`，让一屏里同时看到表头、尽量多的行和横向滚动条。 |
| `frozenColumns` | 左侧 N 列固定，其余列横向滚动；最后一个固定列右侧有分隔线。分组行（`GroupedTableSectionRow`）的标签在横向滚动时留在左边。固定列的宽度按第一行实际宽度计算，表格变化时自动更新。 |

固定列和固定表头的单元格背景为实色：悬停为中性灰，选中行为浅绿，与其他表格一致。不要再覆盖 `.nidec-ui-grouped-table__section-button` 或给 `thead th` 自写 `position: sticky`。

## 矩阵表不属于可编辑表

只有需要输入（填文字、数字，选选项，选日期）的表才算可编辑表，用 `EditableGrid` + `LiteEditableGrid`。只点按钮或开关的表维持普通 `Table` + 标准控件（Locke，2026-10-26）：

- **字段矩阵**：每格一个开关，用 `Table` + 每格 `Switch` 或 `Checkbox`。
- **选择矩阵**：每格一个按钮或链接，点开 `FormDrawer`，用 `Table` + `MatrixCellButton`（或 `RecordLink`）。

## 矩阵表：MatrixCellButton

矩阵表的行是记录（可按分组），列是另一组对象（如 Series），每个格子是一个按钮，点开后在 `FormDrawer` 里编辑该格。

```tsx
<TableCell style={{ padding: 0 }}>
  <MatrixCellButton matched={hasRule} selected={openCell === key} onClick={() => open(key)}>
    {hasRule ? ruleName : ''}
  </MatrixCellButton>
</TableCell>
```

- 整个格子是按钮，悬停中性灰；`matched` 为浅绿底（该格有值）；`selected` 为品牌色内描边（抽屉正在编辑这一格）。
- 单元格 `padding: 0`，让按钮占满格子。格子里的文字单行省略。
- 格子的含义、能否编辑、点开什么由应用决定；不可编辑时传 `disabled`。

## TruncatedText

```tsx
<TableCell><TruncatedText>{component.name}</TruncatedText></TableCell>
```

单行显示，放不下时以省略号结束；只有文字确实被截断时，悬停才显示全文。内容必须是字符串。
