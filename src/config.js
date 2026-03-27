const requireEnv = (value, name) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const GRAPHQL_URI = requireEnv(
  process.env.REACT_APP_IDENTITY_URI,
  "REACT_APP_IDENTITY_URI"
);

export const UPLOAD_URL = requireEnv(
  process.env.REACT_APP_UPLOAD_URL,
  "REACT_APP_UPLOAD_URL"
);

export const PBAC_URL = requireEnv(
  process.env.REACT_APP_PBAC_URL,
  "REACT_APP_PBAC_URL"
);

