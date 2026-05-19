import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function RegisterForm(props) {
    const { fields, handleChange, handleSubmit, loading, error, onDismissError, success, onLoginClick,
        submitLabel = "Register", successMessage, showTerms = true } = props;

    return (
        <Form style={{ border: "1px solid #000", padding: "30px", margin: "10px", borderRadius: "10px", width: "50%", marginLeft: "auto", marginRight: "auto" }}>
            <h4 style={{ marginBottom: "20px" }}>Create an account</h4>

            {error && (
                <Alert variant="danger" dismissible onClose={onDismissError}>
                    {error.message}
                </Alert>
            )}

            {success && (
                <Alert variant="success">
                    {successMessage || (<>Registration successful! You can now <Alert.Link onClick={onLoginClick} style={{ cursor: "pointer" }}>sign in</Alert.Link>.</>)}
                </Alert>
            )}

            <Form.Group controlId="regFirstName" style={{ marginBottom: "10px" }}>
                <Form.Label>First name</Form.Label>
                <Form.Control
                    type="text"
                    name="firstName"
                    value={fields.firstName}
                    placeholder="First name"
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="regLastName" style={{ marginBottom: "10px" }}>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                    type="text"
                    name="lastName"
                    value={fields.lastName}
                    placeholder="Last name"
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="regEmail" style={{ marginBottom: "10px" }}>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={fields.email}
                    placeholder="Enter email"
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="regPassword" style={{ marginBottom: "10px" }}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={fields.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="regCompany" style={{ marginBottom: "10px" }}>
                <Form.Label>Company</Form.Label>
                <Form.Control
                    type="text"
                    name="company"
                    value={fields.company}
                    placeholder="Company name"
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group controlId="regPostCode" style={{ marginBottom: "10px" }}>
                <Form.Label>Post code</Form.Label>
                <Form.Control
                    type="text"
                    name="postCode"
                    value={fields.postCode}
                    placeholder="Post code"
                    onChange={handleChange}
                />
            </Form.Group>

            {showTerms && (
                <Form.Group controlId="regTerms" style={{ margin: "10px 0" }}>
                    <Form.Check
                        type="checkbox"
                        name="terms"
                        label="I agree to the terms and conditions"
                        checked={fields.terms}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
            )}

            <Button variant="primary" type="button" onClick={handleSubmit} disabled={loading || (showTerms && !fields.terms)}>
                {loading ? "Submitting…" : submitLabel}
            </Button>

            {onLoginClick && (
                <div style={{ marginTop: "15px", fontSize: "0.9rem" }}>
                    Already have an account?{" "}
                    <span onClick={onLoginClick} style={{ cursor: "pointer", color: "#0d6efd", textDecoration: "underline" }}>
                        Sign in
                    </span>
                </div>
            )}
        </Form>
    );
}

export default RegisterForm;
