import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Card, Button, Alert } from "react-bootstrap";

const CREATE_POLICY = gql`
  mutation CreatePolicy(
    $name: String!
    $description: String!
    $module: String!
    $content: String!
  ) {
    createPolicy(
      name: $name
      description: $description
      module: $module
      content: $content
    ) {
      id
      name
    }
  }
`;

const DEFAULT_POLICY = {
  name: "Admin Access",
  description: "Allow admins only",
  module: "authz",
  content: `package authz

default allow = false

allow {
  input.role == "admin"
}`
};

function PolicyCreator() {
  const [createPolicy, { loading, error, data, reset }] = useMutation(
    CREATE_POLICY,
    {
      context: {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      }
    }
  );

  const createDefaultPolicy = async () => {
    reset();
    try {
      await createPolicy({ variables: DEFAULT_POLICY });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Create policy error:", err);
    }
  };

  return (
    <Card style={{ maxWidth: "600px", margin: "20px auto", padding: "20px" }}>
      <Card.Body>
        <Card.Title style={{ marginBottom: "20px", textAlign: "center" }}>
          Policies
        </Card.Title>

        <p style={{ color: "#6c757d", marginBottom: "20px" }}>
          Create a default policy in the policy service.
        </p>

        {data && (
          <Alert variant="success" style={{ marginBottom: "20px" }}>
            ✓ Policy created successfully!
          </Alert>
        )}

        {error && (
          <Alert variant="danger" style={{ marginBottom: "20px" }}>
            ✗ {error.graphQLErrors?.[0]?.message ||
               error.networkError?.message ||
               "Policy creation failed. Please try again."}
          </Alert>
        )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="primary"
            onClick={createDefaultPolicy}
            disabled={loading}
          >
            {loading ? "Creating Policy..." : "Create Default Policy"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PolicyCreator;
