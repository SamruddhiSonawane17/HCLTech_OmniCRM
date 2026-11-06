# OmniCRM

OmniCRM is a responsive Angular CRM and sales-automation demonstration. It includes a dashboard, customer and lead management, a sales Kanban, communication activity, tasks, analytics, and workspace settings.

## Run locally

```bash
npm install
ng serve -o
```

The app is available at `http://localhost:4200/`. Unauthenticated visitors start at the sign-in page and can create a local demo session from the sign-up form. Sign-in accepts any valid email and password with at least 8 characters. Sign-up does not create a real account or store passwords; the browser-local session is only a frontend demonstration and is not a security boundary.

The app uses standalone Angular components, Angular Router, reactive forms, RxJS, Chart.js, and Bootstrap Icons.

## Build and test

```bash
npm run build
npm test -- --watch=false
```

## Demo data

Sample customers, leads, deals, tasks, interactions, and settings are persisted in browser local storage. Use the in-app forms and actions to add, edit, filter, update, and remove records. Communication items are sample records only; no external messaging services or backend are connected. The Reports page can export a CSV summary.
