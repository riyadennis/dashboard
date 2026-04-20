import { useQuery } from "@apollo/client/react";
import { gql } from '@apollo/client';
import React from "react";

const ME = gql`
  query Me {
    me {
      id
      email
      name
      picture
      emailVerified
    }
  }
`;

const GET_USER_ROLE = gql`
  query GetUserRole($userId: String!) {
    getUserRole(userId: $userId) {
      userId
      role
    }
  }
`;

function TimeOfDay() {
    const token = localStorage.getItem('accessToken');
    const authHeaders = { authorization: token ? `Bearer ${token}` : '' };

    const { data, loading, error } = useQuery(ME, {
        context: { headers: authHeaders },
        onCompleted: (data) => {
            if (data?.me) {
                localStorage.setItem("userID", data.me.id);
                localStorage.setItem("userEmail", data.me.email);
                localStorage.setItem("userName", data.me.name);
            }
        },
        onError: (error) => {
            console.error("Me query error:", error);
        }
    });

    const userId = data?.me?.id;

    const { data: roleData, loading: roleLoading } = useQuery(GET_USER_ROLE, {
        variables: { userId },
        context: { headers: authHeaders },
        skip: !userId,
        onCompleted: (data) => {
            if (data?.getUserRole?.role) {
                localStorage.setItem("userRole", data.getUserRole.role);
            }
        },
        onError: (error) => {
            console.error("GetUserRole query error:", error);
        }
    });

    const date = new Date();
    const hours = date.getHours();
    let timeOfDay;
    const styles = {};

    if (hours < 12) {
        timeOfDay = "morning";
        styles.color = "#d9d610";
    } else if (hours >= 12 && hours <= 17) {
        timeOfDay = "after noon";
        styles.color = "#d94452";
    } else {
        timeOfDay = "night";
        styles.color = "#2831d9";
    }

    if (loading) {
        return <div>Loading user data...</div>;
    }

    if (error) {
        return <div>Error loading user data: {error.message}</div>;
    }

    const userName = data?.me?.name || 'User';
    const role = roleData?.getUserRole?.role;

    return (
        <div>
            <h1 style={styles}>Hello Good {timeOfDay}, {userName}!</h1>
            {data?.me && (
                <div style={{ marginTop: '20px' }}>
                    {data.me.picture && (
                        <img
                            src={data.me.picture}
                            alt="Profile"
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginBottom: '15px'
                            }}
                        />
                    )}
                    <div><strong>Email:</strong> {data.me.email}</div>
                    <div style={{ marginTop: '8px' }}>
                        <strong>Email verified:</strong>{' '}
                        {data.me.emailVerified ? '✅ Yes' : '❌ No'}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                        <strong>Role:</strong>{' '}
                        {roleLoading ? 'Loading...' : (role || 'Unknown')}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TimeOfDay;
