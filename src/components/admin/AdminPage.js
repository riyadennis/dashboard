import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Card from "react-bootstrap/Card";
import UserTable from "./UserTable";

function AdminPage() {
    return (
        <div>
            <h3>Admin Dashboard</h3>
            <Tabs defaultActiveKey="users" id="admin-tabs">
                <Tab eventKey="users" title="Users">
                    <Card>
                        <Card.Body>
                            <Card.Title>User Management</Card.Title>
                            <UserTable />
                        </Card.Body>
                    </Card>
                </Tab>
                <Tab eventKey="settings" title="Settings">
                    <Card>
                        <Card.Body>
                            <Card.Title>System Settings</Card.Title>
                            <Card.Text>
                                Manage application settings, user roles, and system configuration.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
}

export default AdminPage;
