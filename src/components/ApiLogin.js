import { useState } from 'react';
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

function ApiLogin(state, props){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login] = useMutation(LOGIN, {
        variables: {
            input: {
                email: email,
                password: password
            }
          }
      });
    login();
    props.handler(login.data.Login)
}


export default ApiLogin