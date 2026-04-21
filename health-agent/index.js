/**
 * Dashboard Health Agent
 *
 * Runs all service checks in parallel, fills a pre-built HTML template with
 * the results, and serves the report on a dedicated port.
 *
 * Requires: ANTHROPIC_API_KEY is NOT needed — no Claude API call.
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { readFile, writeFile } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

config({ path: resolve(__dirname, ".env") });
config({ path: resolve(projectRoot, ".env") });
config({ path: resolve(projectRoot, ".env.example") });

const GRAPHQL_URL =
  process.env.REACT_APP_IDENTITY_URI || "http://localhost:8092/graphql";
const UPLOAD_URL =
  process.env.REACT_APP_UPLOAD_URL || "http://localhost:8091/upload";
const PBAC_URL = process.env.REACT_APP_PBAC_URL || "http://localhost:8080";
const FRONTEND_URL = "http://localhost:3000";
const GRPC_HOST = process.env.IDENTITY_GRPC_HOST || "localhost";
const GRPC_PORT = process.env.IDENTITY_GRPC_PORT || "8096";
const REPORT_PORT = parseInt(process.env.HEALTH_REPORT_PORT || "3001", 10);
const REPORT_PATH = resolve(__dirname, "health.html");
const TEMPLATE_PATH = resolve(__dirname, "template.html");
const TIMEOUT_MS = 5000;

// --- Health check functions ---

async function checkHttp(name, url, method = "GET", options = {}) {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method,
      headers: options.headers || {},
      body: options.body ?? undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return {
      name,
      url,
      protocol: "HTTP",
      reachable: true,
      status: res.status,
      responseTimeMs: Date.now() - start,
      error: null,
    };
  } catch (err) {
    return {
      name,
      url,
      protocol: "HTTP",
      reachable: false,
      status: null,
      responseTimeMs: Date.now() - start,
      error: err.message,
    };
  }
}

async function checkGrpc() {
  try {
    const { stdout } = await execAsync("node grpc-check.js", {
      cwd: __dirname,
      timeout: TIMEOUT_MS + 3000,
    });
    return {
      name: "Identity gRPC server",
      protocol: "gRPC",
      ...JSON.parse(stdout.trim()),
    };
  } catch (err) {
    return {
      name: "Identity gRPC server",
      protocol: "gRPC",
      target: `${GRPC_HOST}:${GRPC_PORT}`,
      reachable: false,
      grpcCode: 14,
      grpcMessage: err.message,
      responseTimeMs: TIMEOUT_MS,
      response: null,
    };
  }
}

async function checkMeQuery(accessToken) {
  if (!accessToken) {
    return {
      name: "Identity GraphQL — me query",
      protocol: "GraphQL",
      url: GRAPHQL_URL,
      skipped: true,
      reason: "No access token — gRPC Login did not return a token",
    };
  }
  const start = Date.now();
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query: "query Me { me { id email } }" }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = await res.json();
    return {
      name: "Identity GraphQL — me query",
      protocol: "GraphQL",
      url: GRAPHQL_URL,
      reachable: true,
      status: res.status,
      responseTimeMs: Date.now() - start,
      hasValidUser: !!(body.data?.me?.id),
      me: body.data?.me || null,
      errors: body.errors || null,
    };
  } catch (err) {
    return {
      name: "Identity GraphQL — me query",
      protocol: "GraphQL",
      url: GRAPHQL_URL,
      reachable: false,
      status: null,
      responseTimeMs: Date.now() - start,
      error: err.message,
    };
  }
}

// --- Status classification ---

function classifyStatus(result) {
  if (result.skipped) return "skipped";

  if (result.protocol === "gRPC") {
    if (!result.reachable) return "unhealthy";
    // UNAUTHENTICATED (16) or OK (0) = server is up
    if (result.grpcCode === 0 || result.grpcCode === 16)
      return result.responseTimeMs >= 500 ? "degraded" : "healthy";
    return "unhealthy";
  }

  if (result.protocol === "GraphQL") {
    if (!result.reachable) return "unhealthy";
    if (!result.hasValidUser || result.errors?.length) return "unhealthy";
    return result.responseTimeMs >= 500 ? "degraded" : "healthy";
  }

  // HTTP
  if (!result.reachable) return "unhealthy";
  if (result.status >= 200 && result.status < 300)
    return result.responseTimeMs >= 500 ? "degraded" : "healthy";
  if (result.status >= 300 && result.status < 400) return "degraded";
  return "unhealthy";
}

function overallStatus(statuses) {
  if (statuses.includes("unhealthy")) return "unhealthy";
  if (statuses.includes("degraded")) return "degraded";
  if (statuses.every((s) => s === "healthy" || s === "skipped")) return "healthy";
  return "degraded";
}

// --- Template rendering ---

function escape(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderCard(result) {
  const status = classifyStatus(result);
  const label =
    status === "healthy"
      ? "Healthy"
      : status === "degraded"
      ? "Degraded"
      : status === "skipped"
      ? "Skipped"
      : "Unhealthy";

  const urlOrTarget =
    result.url || result.target || `${GRPC_HOST}:${GRPC_PORT}`;

  const rows = [];

  rows.push(`
    <div class="meta-row">
      <span class="meta-label">Protocol</span>
      <span class="meta-value">${escape(result.protocol)}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Endpoint</span>
      <span class="meta-value url">${escape(urlOrTarget)}</span>
    </div>`);

  if (!result.skipped) {
    if (result.responseTimeMs != null) {
      rows.push(`
    <div class="meta-row">
      <span class="meta-label">Response time</span>
      <span class="meta-value">${result.responseTimeMs} ms</span>
    </div>`);
    }

    if (result.protocol === "gRPC") {
      rows.push(`
    <div class="meta-row">
      <span class="meta-label">gRPC code</span>
      <span class="meta-value">${escape(result.grpcCode ?? "—")} ${escape(result.grpcMessage ?? "")}</span>
    </div>`);
    } else if (result.status != null) {
      rows.push(`
    <div class="meta-row">
      <span class="meta-label">HTTP status</span>
      <span class="meta-value">${escape(result.status)}</span>
    </div>`);
    }
  }

  let extra = "";
  if (result.skipped) {
    extra = `<div class="card-skip">${escape(result.reason)}</div>`;
  } else if (result.error) {
    extra = `<div class="card-error">${escape(result.error)}</div>`;
  } else if (result.errors?.length) {
    extra = `<div class="card-error">${result.errors.map((e) => escape(e.message)).join("<br>")}</div>`;
  } else if (result.me) {
    extra = `<div class="card-info">Authenticated as: <strong>${escape(result.me.email)}</strong></div>`;
  }

  return `
    <div class="card ${status}">
      <div class="card-header">
        <span class="card-name">${escape(result.name)}</span>
        <span class="badge ${status}">${label}</span>
      </div>
      <div class="card-meta">${rows.join("")}</div>
      ${extra}
    </div>`;
}

function renderIssues(results, statuses) {
  const items = [];

  results.forEach((result, i) => {
    const status = statuses[i];
    if (status === "healthy") return;

    if (status === "skipped") {
      items.push(
        `<li class="warning"><strong>${escape(result.name)}:</strong> ${escape(result.reason)}</li>`
      );
      return;
    }

    if (status === "degraded") {
      items.push(
        `<li class="warning"><strong>${escape(result.name)}:</strong> Slow response (${result.responseTimeMs}ms). Check server load and network latency.</li>`
      );
      return;
    }

    // unhealthy
    if (result.protocol === "gRPC") {
      items.push(
        `<li class="issue"><strong>${escape(result.name)}:</strong> gRPC code ${escape(result.grpcCode)} — ${escape(result.grpcMessage)}. Ensure the container is running and port ${GRPC_PORT} is reachable.</li>`
      );
    } else if (!result.reachable) {
      items.push(
        `<li class="issue"><strong>${escape(result.name)}:</strong> Unreachable at ${escape(result.url || result.target)}. Check that the service is running and the URL in .env is correct.</li>`
      );
    } else if (result.errors?.length) {
      items.push(
        `<li class="issue"><strong>${escape(result.name)}:</strong> GraphQL errors — ${result.errors.map((e) => escape(e.message)).join("; ")}. Verify auth middleware and database connectivity.</li>`
      );
    } else {
      items.push(
        `<li class="issue"><strong>${escape(result.name)}:</strong> HTTP ${escape(result.status ?? "no response")}. ${escape(result.error ?? "")}</li>`
      );
    }
  });

  if (items.length === 0) {
    items.push(`<li class="ok">All services are operating normally.</li>`);
  }

  return items.join("\n      ");
}

function buildReport(template, results, checkedAt) {
  const statuses = results.map(classifyStatus);
  const overall = overallStatus(statuses);

  const overallText = {
    healthy: "All Systems Operational",
    degraded: "Some Services Degraded",
    unhealthy: "One or More Services Down",
  }[overall];

  return template
    .replace("{{CHECKED_AT}}", escape(checkedAt))
    .replace("{{OVERALL_CLASS}}", overall)
    .replace("{{OVERALL_TEXT}}", overallText)
    .replace("{{SERVICE_CARDS}}", results.map(renderCard).join("\n"))
    .replace("{{ISSUES_LIST}}", renderIssues(results, statuses));
}

// --- Main ---

console.log("Dashboard Health Agent starting...");
console.log("");
console.log("Running checks in parallel:");
console.log(`  Upload   : ${UPLOAD_URL}`);
console.log(`  PBAC     : ${PBAC_URL}/policies`);
console.log(`  Frontend : ${FRONTEND_URL}`);
console.log(`  gRPC     : ${GRPC_HOST}:${GRPC_PORT} (Identity.Login)`);
console.log(`  me query : ${GRAPHQL_URL} (authenticated via gRPC token)`);
console.log("");

const [uploadResult, pbacResult, frontendResult, grpcResult] =
  await Promise.all([
    checkHttp("Upload service", UPLOAD_URL, "OPTIONS"),
    checkHttp("PBAC service", `${PBAC_URL}/policies`, "GET"),
    checkHttp("React frontend", FRONTEND_URL, "GET"),
    checkGrpc(),
  ]);

// me query runs after gRPC since it needs the token
const meResult = await checkMeQuery(grpcResult.response?.accessToken);

const results = [uploadResult, pbacResult, frontendResult, grpcResult, meResult];
const checkedAt = new Date().toUTCString();

const template = await readFile(TEMPLATE_PATH, "utf-8");
const html = buildReport(template, results, checkedAt);
await writeFile(REPORT_PATH, html, "utf-8");

console.log("Report ready.");

// --- Serve the report ---

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

const server = createServer(async (req, res) => {
  const url = req.url === "/" ? "/health.html" : req.url;

  // Only serve known static files from health-agent directory
  const safeName = url.replace(/^\//, "").replace(/[^a-zA-Z0-9._-]/g, "");
  const ext = safeName.substring(safeName.lastIndexOf("."));
  const mime = MIME_TYPES[ext];

  if (!mime) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }

  try {
    const filePath = resolve(__dirname, safeName);
    const content = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mime });
    res.end(content);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(REPORT_PORT, () => {
  console.log(`\nHealth report ready at: http://localhost:${REPORT_PORT}`);
  console.log("Press Ctrl+C to stop.");
});
