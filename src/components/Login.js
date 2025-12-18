import React, { useState } from "react";
import LoginForm from "./LoginContainer"
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const LOGIN = gql`
 mutation Login($input: LoginInput!){
	Login(input: $input){
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

    const [login, { data, loading, error }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            if (data?.Login) {
                // Handle successful login
                console.log("Login successful:", data.Login);
                // You can call props.handler here if needed
                if (props.handler) {
                    props.handler(data.Login);
                }
            }
        },
        onError: (error) => {
            console.error("Login error:", error);
        }
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // call login endpoint
        login({
            variables: {
                input: {
                    email: email,
                    password: password
                }
            }
        });
    };

    return <LoginForm
        email={email}
        password={password}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
    />;
}

export default Login