import React from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const LIST_USERS = gql`
  query listUsers {
    listUsers {
      id
      email
      name
      picture
      emailVerified
    }
  }
`;

function Admin() {
    const token = localStorage.getItem('accessToken');
    const { data, loading, error } = useQuery(LIST_USERS, {
        context: {
            headers: { authorization: token ? `Bearer ${token}` : '' },
        },
        fetchPolicy: 'network-only',
    });

    return (
        <div>
            <h3>Admin Dashboard</h3>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>User Management</Card.Title>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Email Verified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="3" className="text-center">Loading users...</td>
                                </tr>
                            )}
                            {error && (
                                <tr>
                                    <td colSpan="3" className="text-center text-danger">
                                        Error loading users: {error.message}
                                    </td>
                                </tr>
                            )}
                            {data?.listUsers?.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.emailVerified ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                            {data?.listUsers?.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <Card>
                <Card.Body>
                    <Card.Title>System Settings</Card.Title>
                    <Card.Text>
                        Manage application settings, user roles, and system configuration.
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Admin;
