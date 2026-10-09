InlineModeTabs switches the editing mode and visible panel of one nearby local editor without changing the surrounding page, record or business state.

Use it only when two or a few short options are alternative ways to edit the same property, the surrounding context stays unchanged, and selecting an option does nothing except change the adjacent panel. For stronger prominence use SegmentedControl. For navigation use Tabs. For many or long options use RadioGroup.

The consumer provides unique `tabId` and `panelId` values, the controlled `value`, and keeps the draft values of every mode while another panel is visible. Validation, saving and permissions stay with the application.

- The pill track is `fit-content` and `max-width: 100%`; do not stretch it to the field width.
- Each tab is 20px high with one line; the selected tab uses brand fill, on-brand text and semibold weight.
- Put the pill and its panel in a start-aligned grid with `space-xs` between them.
- In repeated rows give the editor column one fixed bounded width so the pill does not move.
