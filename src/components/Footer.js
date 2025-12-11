import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

class Footer extends React.Component{
    render() {
        return(
            <footer>
                <Card style={{width: "100%", margin: "10px", padding: "10px", textAlign: "center"}}>
                    <Card.Body>
                        <Card.Title>Copyright © 2025</Card.Title>
                        <Card.Text>
                            All rights reserved.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </footer>
        )
    }
}
export default Footer