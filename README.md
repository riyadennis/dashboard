# dashboard

Landing app from where we can call multiple clients.

## Getting started

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js)

### Install dependencies

From the project root:

```bash
cd /Users/riyadennis/go/src/github.com/riyadennis/dashboard
npm install
```

### Run the app

Start the development server:

```bash
npm start
```

This will start the app (by default) at `http://localhost:3000` in your browser.

## Application flow

```mermaid
flowchart TD
  U[User] --> B[Browser]
  B -->|Loads UI| FE[Dashboard React App :3000]

  FE -->|Login / Auth (if applicable)| AUTH[Auth flow]
  AUTH --> FE

  FE -->|GraphQL queries/mutations| GQL[GraphQL API :8097/graphql]
  GQL -->|Data responses| FE

  FE -->|Upload file (multipart/form-data)| UP[REST Upload API :8090/upload]
  UP -->|Upload result| FE

  FE -->|Render pages: profile, data, status| B
```

## GraphQL server dependency

This app expects a GraphQL server to be available at:

- `http://localhost:8097/graphql`

If you run the app via Docker Compose, the frontend is configured with:

- `REACT_APP_GRAPHQL_URI=http://localhost:8097/graphql`

## REST upload dependency

File uploads expect a REST endpoint to be available at:

- `http://localhost:8090/upload`
