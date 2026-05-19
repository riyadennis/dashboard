import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import RegisterForm from "../RegisterForm";

const CREATE_USER = gql`
  mutation createUser($input: RegisterInput!) {
    createUser(input: $input) {
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

function CreateUser() {
    const [fields, setFields] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        company: "",
        postCode: "",
        terms: true,
    });
    const [errorDismissed, setErrorDismissed] = useState(false);
    const [success, setSuccess] = useState(false);

    const [createUser, { loading, error }] = useMutation(CREATE_USER, {
        onCompleted: () => {
            setSuccess(true);
            setFields({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                company: "",
                postCode: "",
                terms: false,
            });
        },
        onError: (err) => {
            console.error("Create user error:", err);
        },
    });

    useEffect(() => {
        if (error) setErrorDismissed(false);
    }, [error]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setSuccess(false);
        setFields((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('accessToken');
        createUser({
            context: {
                headers: { authorization: token ? `Bearer ${token}` : '' },
            },
            variables: {
                input: {
                    firstName: fields.firstName,
                    lastName: fields.lastName,
                    email: fields.email,
                    password: fields.password,
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
            submitLabel="Create User"
            successMessage="User created successfully!"
            showTerms={false}
        />
    );
}

export default CreateUser;
