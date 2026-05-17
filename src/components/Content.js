import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import TimeOfDay from "./Profile";
import FileUploader from "./FileUploader";
import PolicyCreator from "./PolicyCreator";
import Admin from "./Admin";


class Content extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: (localStorage.getItem('userRole') || '').toUpperCase() === 'ADMIN',
        };
        this.handleRoleLoaded = this.handleRoleLoaded.bind(this);
    }

    handleRoleLoaded(role) {
        this.setState({
            isAdmin: (role || '').toUpperCase() === 'ADMIN',
        });
    }

    render() {
        const { isAdmin } = this.state;

        return(
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="home" title="Home">
                    <Card>
                        <Card.Body>
                            <Card.Title>Upload File</Card.Title>
                            <Card.Text>
                                <FileUploader/>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Tab>
                <Tab eventKey="policies" title="Policies">
                    <Card>
                        <Card.Body>
                            <Card.Title>Create Policy</Card.Title>
                            <Card.Text>
                                <PolicyCreator/>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Tab>
                <Tab eventKey="profile" title="Profile">
                    <Card>
                        <Card.Body>
                            <Card.Title> <TimeOfDay onRoleLoaded={this.handleRoleLoaded}/></Card.Title>
                            <Card.Text>
                                {this.props.userData.message}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Tab>
                {isAdmin && (
                    <Tab eventKey="admin" title="Admin">
                        <Card>
                            <Card.Body>
                                <Admin/>
                            </Card.Body>
                        </Card>
                    </Tab>
                )}
                <Tab eventKey="contact" title="Contact" disabled>
                    <Card>
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                            </Card.Text>
                            <Button variant="primary">Go somewhere</Button>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
        )
    }
}

export default Content
