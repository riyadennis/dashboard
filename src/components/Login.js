import React from "react";
import LoginForm from "./LoginContainer"
import axios from "axios";

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            isLoggedIn: false,
            email: "",
            password: "",
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange= this.handleChange.bind(this);
    }
    handleChange(event){
        const {name,value} = event.target
        this.setState({
            [name] : value
        })
    }
    handleSubmit(event){
        console.log('form submitted: ' + this.state.email);
        let loginCall = function (data, props, callback) {
            axios.post('http://localhost:8081/login/',
                {
                    email: data.email,
                    password: data.password
                },{
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
                .then(function (response) {
                    if (response.status === 200){
                        props.handler()
                        callback(props, response.data)
                    }
                })
                .catch(function (error) {
                    HandleAxiosError(error)
                    console.log(error.config);
                });
        }
        loginCall(this.state, this.props, function(props, response) {
            props.handler()
            console.log(response)
        });
        event.preventDefault();
    }

    render() {
       return  <LoginForm email={this.state.email} password={this.state.password}
                          handler = {this.handler}  handleChange={this.handleChange}
                          handleSubmit={this.handleSubmit}/>
    }
}

function HandleAxiosError(error){
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("response data "+error.response.data);
        console.log("response status "+error.response.status);
        console.log("response headers "+error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log("request error"+error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
}
export default Login