# AG Grid Multi-Panel Reconciliation

This is a prototype React application demonstrating an interactive, multi-panel AG Grid layout. It simulates a reconciliation process between two source datasets, allowing selected rows to be pushed to a top aggregation table.

## Features

- AG Grid with filters, sorting, and grouping
- Master-detail grid layout with expansion per row
- Multi-select rows with checkboxes
- Push selected rows from Source A or B to a central aggregation grid
- Dataset toggle between "Properties" and "Franchises"
- Top grid state is persisted via localStorage
- One-click clearing of the top grid

## Tech Stack

- React + TypeScript
- AG Grid Community + Enterprise Modules (no server-side dependency)
- Tailwind-compatible layout styling

## Getting Started

```bash
# Install dependencies
npm install

# Run the app locally
npm run dev
```

## Deployment

Push this project to your GitHub repository and optionally host it with GitHub Pages, Vercel, or Netlify.

## Author

Built with ❤️ by [Saulo]
