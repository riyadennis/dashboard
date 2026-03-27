import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import RegisterForm from "./RegisterForm";

const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    Register(input: $input) {
      id
      firstName
      lastName
      email
      company
      postCode
      terms
      createdAt
    }
  }
`;

function Register(props) {
    const [fields, setFields] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        postCode: "",
        terms: false,
    });
    const [errorDismissed, setErrorDismissed] = useState(false);
    const [success, setSuccess] = useState(false);

    const [register, { loading, error }] = useMutation(REGISTER, {
        onCompleted: () => {
            setSuccess(true);
            if (props.onRegistered) props.onRegistered();
        },
        onError: (err) => {
            console.error("Register error:", err);
        },
    });

    useEffect(() => {
        if (error) setErrorDismissed(false);
    }, [error]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFields((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        register({
            variables: {
                input: {
                    firstName: fields.firstName,
                    lastName: fields.lastName,
                    email: fields.email,
                    company: fields.company,
                    postCode: fields.postCode,
                    terms: fields.terms,
                },
            },
        });
    };

    return (
        <RegisterForm
            fields={fields}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error && !errorDismissed ? { message: error.message } : null}
            onDismissError={() => setErrorDismissed(true)}
            success={success}
            onLoginClick={props.onLoginClick}
        />
    );
}

export default Register;
