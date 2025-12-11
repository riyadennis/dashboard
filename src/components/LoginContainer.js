import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React from "react";

function LoginForm(props) {
    return(
        <Form style={{border: "1px solid #000", padding: "30px", margin: "10px", borderRadius: "10px", width: "50%", marginLeft: "auto", marginRight: "auto"}}>
            <Form.Group controlId="formBasicEmail" style={{marginBottom: "10px"}}>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" name="email" value={props.email}
                              placeholder="Enter email" onChange={props.handleChange} required/>
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={props.password}
                              placeholder="Password" onChange={props.handleChange} required/>
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox" style={{margin: "10px"}}>
                <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="button" onClick={props.handleSubmit}>
                Submit
            </Button>
        </Form>
    )
}

export default LoginForm