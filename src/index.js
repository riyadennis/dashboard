import React from "react";
import { createRoot } from "react-dom/client";
import DashBoard from "./DashBoard";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<DashBoard />);
