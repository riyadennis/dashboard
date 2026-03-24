import React from "react";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from "react-dom/client";
import DashBoard from "./DashBoard";
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import axios from "axios";
import { GRAPHQL_URI, PBAC_URL, UPLOAD_URL } from "./config";

const client = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_URI,
  }),
  cache: new InMemoryCache(),
});

const container = document.getElementById("root");
const root = createRoot(container);

const servicesToCheck = [
  {
    name: "GraphQL service",
    url: GRAPHQL_URI,
    method: "post",
    data: { query: "query StartupCheck { __typename }" },
    headers: { "Content-Type": "application/json" }
  },
  {
    name: "Upload service",
    url: UPLOAD_URL,
    method: "options"
  },
  {
    name: "PBAC service",
    url: "/policies",
    method: "get"
  }
];

const checkService = async ({ name, url, method, data, headers }) => {
  try {
    await axios({
      url,
      method,
      data,
      headers,
      timeout: 5000,
      validateStatus: () => true
    });
  } catch (error) {
    throw new Error(`${name} is not reachable at ${url}: ${error.message}`);
  }
};

const renderStartupError = (message) => {
  root.render(
    <div style={{ maxWidth: "720px", margin: "40px auto", padding: "20px" }}>
      <h2>Startup check failed</h2>
      <p>{message}</p>
      <p>
        Ensure all backend services are running and accessible from the browser,
        then refresh the page.
      </p>
    </div>
  );
};

const bootstrapApp = async () => {
  try {
    await Promise.all(servicesToCheck.map(checkService));
    root.render(
      <ApolloProvider client={client}>
        <DashBoard />
      </ApolloProvider>
    );
  } catch (error) {
    renderStartupError(error.message);
  }
};

bootstrapApp();
reportWebVitals();