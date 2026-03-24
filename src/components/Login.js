import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import LoginForm from "./LoginContainer";

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    Login(input: $input) {
      status
      accessToken
      expiry
      tokenType
      lastRefresh
      tokenTTL
    }
  }
`;

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorDismissed, setErrorDismissed] = useState(false);

    const [login, { loading, error }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            if (data?.Login) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("accessToken", data.Login.accessToken);
                if (props.handler) {
                    props.handler({ ...data.Login, token: data.Login.accessToken });
                }
            }
        },
        onError: (err) => {
            console.error("Login error:", err);
        }
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "email") setEmail(value);
        else if (name === "password") setPassword(value);
    };

    useEffect(() => {
        if (error) setErrorDismissed(false);
    }, [error]);

    const handleSubmit = (event) => {
        event.preventDefault();
        login({
            variables: {
                input: { email, password }
            }
        });
    };

    return (
        <LoginForm
            email={email}
            password={password}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error && !errorDismissed ? { message: error.message } : null}
            onDismissError={() => setErrorDismissed(true)}
        />
    );
}

export default Login