# 可编辑表轻量化研究原型

研究用，不属于 UI 包：不进 `src/`、不打包、不发布。目的是在定方案前，把“现状（表格里放 Fluent 标准控件）”和“轻量型（单元格本身就是编辑器）”放在同一组数据、同一组行高下对比，尤其是行高变化时的效果。

## 运行

先在仓库根目录 `npm ci`，然后：

```
node research/editable-grid-lite/build.mjs        # 生成 research/editable-grid-lite/dist/index.html（单文件）
node research/editable-grid-lite/measure.mjs      # 用 Chromium 测量并截图到 dist/shots
```

页面地址参数：`?view=matrix`（全部对比）或 `?scenario=current|lite-row|lite-cell&h=32|40|48|auto&frame=cell|inset|underline`。
