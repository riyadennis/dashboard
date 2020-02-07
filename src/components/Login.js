import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            userRegistered: false,
            email: "",
            password: "",
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange= this.handleEmailChange.bind(this)
        this.handlePasswordChange= this.handlePasswordChange.bind(this)
    }
    handleEmailChange(event){
        this.setState({
                email: event.target.value
        })
    }
    handlePasswordChange(event){
        this.setState({
            password: event.target.value
        })
    }
    handleSubmit(event){
        console.log('form submitted: ' + this.state.email);
        axios
            // The API we're requesting data from
            .post("http://localhost:8081/login", )
        event.preventDefault();
    }
    render() {
        return(
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={this.handleEmailChange}/>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="button" onClick={this.handleSubmit}>
                    Submit
                </Button>
            </Form>
        )
    }
}

export default Login