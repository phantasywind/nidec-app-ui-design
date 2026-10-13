Pagination moves through a long result list one page at a time: range text such as "26–50 of 60", previous and next icon buttons, and an optional page-size choice.

Put it right after the results it governs, right-aligned, inside the same module. Import `Pagination` from the package entry.

| Prop | Values | Default |
| --- | --- | --- |
| `aria-label` | name of the navigation landmark, for example "Result pages" | required |
| `page` | one-based current page; must be between 1 and the page count | required |
| `pageSize`, `totalCount` | positive integer, non-negative integer | required |
| `onPageChange` | `(event, page) => void` | required |
| `pageSizeOptions` + `onPageSizeChange` | page sizes to offer, and `(event, pageSize) => void`; the choice appears only when both are given | none |
| `formatRange` | `(start, end, totalCount) => string` | `26–50 of 60`, `0 of 0` when empty |
| `previousLabel`, `nextLabel`, `pageSizeLabel` | localised labels; the step buttons show them as tooltips | `Previous page`, `Next page`, `Rows per page` |

- Previous is disabled on the first page and next on the last. The range text is announced politely when it changes.
- Changing the query or page size should return to page 1; switching List and Card keeps the page.
- The application owns the query, the page state, loading and total count. For "load more" or infinite scrolling, do not use Pagination.
