import React from "react";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from "react-dom/client";
import DashBoard from "./DashBoard";
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8097/graphql',
  }),
  cache: new InMemoryCache(),
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <ApolloProvider client={client}>
    <DashBoard />
  </ApolloProvider>
);
reportWebVitals();