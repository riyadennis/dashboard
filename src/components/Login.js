import React from "react";
import LoginForm from "./LoginContainer"
import ApiLogin from "./ApiLogin";

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
        // call login endpoint
        ApiLogin(this.state, this.props);
        event.preventDefault();
    }

    render() {
       return  <LoginForm email={this.state.email} password={this.state.password}
                          handler = {this.handler}  handleChange={this.handleChange}
                          handleSubmit={this.handleSubmit}/>
    }
}

export default Login