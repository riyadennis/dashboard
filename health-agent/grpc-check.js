/**
 * gRPC health check for the identity-grpc-server.
 * Calls the Identity.Login RPC and prints a JSON result to stdout.
 *
 * Usage: node grpc-check.js
 * Exit 0 = reachable (any gRPC response received)
 * Exit 1 = unreachable / error
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const __dirname = dirname(fileURLToPath(import.meta.url));

config({ path: resolve(__dirname, ".env") });

const GRPC_HOST = process.env.IDENTITY_GRPC_HOST || "localhost";
const GRPC_PORT = process.env.IDENTITY_GRPC_PORT || "8096";
const TEST_EMAIL = process.env.GRPC_TEST_EMAIL || "";
const TEST_PASSWORD = process.env.GRPC_TEST_PASSWORD || "";

const PROTO_PATH = resolve(__dirname, "proto", "identity.proto");
const TARGET = `${GRPC_HOST}:${GRPC_PORT}`;

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDef);
const IdentityService = proto.Identity;

const deadline = new Date();
deadline.setSeconds(deadline.getSeconds() + 5);

const client = new IdentityService(TARGET, grpc.credentials.createInsecure());

const start = Date.now();

client.Login(
  { email: TEST_EMAIL, password: TEST_PASSWORD },
  { deadline },
  (err, response) => {
    const elapsed = Date.now() - start;

    if (err) {
      // The server is reachable but returned a gRPC error (e.g. UNAUTHENTICATED)
      // — that still means it's up. An UNAVAILABLE code means it's down.
      const isDown =
        err.code === grpc.status.UNAVAILABLE ||
        err.code === grpc.status.DEADLINE_EXCEEDED;

      console.log(
        JSON.stringify({
          target: TARGET,
          reachable: !isDown,
          grpcCode: err.code,
          grpcMessage: err.message,
          responseTimeMs: elapsed,
          response: null,
        })
      );
      process.exit(isDown ? 1 : 0);
    }

    console.log(
      JSON.stringify({
        target: TARGET,
        reachable: true,
        grpcCode: grpc.status.OK,
        grpcMessage: "OK",
        responseTimeMs: elapsed,
        response: {
          status: response.status,
          accessToken: response.access_token || null,
          tokenType: response.token_type || null,
          expiry: response.expiry || null,
        },
      })
    );
    process.exit(0);
  }
);
