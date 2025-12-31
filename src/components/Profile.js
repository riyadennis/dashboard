import { useQuery } from "@apollo/client/react";
import { gql } from '@apollo/client';
import React from "react";

const ME = gql`
 query me{
	me{
		id
		email
		name
		picture
	}
}
`;


function TimeOfDay(){
    const token = localStorage.getItem('accessToken');

    const { data, loading, error } = useQuery(ME, {
            context: {
                headers: {
                    authorization: token ? `Bearer ${token}` : '',
                }
            },
            onCompleted: (data) => {
                if (data?.me) {
                    localStorage.setItem("userID", data.me.id)
                    localStorage.setItem("userEmail", data.me.email)
                    // console.log("User data:", data.me)
                }
            },
            onError: (error) => {
                console.error("Me query error:", error);
            }
    });

    const date = new Date()
    const hours = date.getHours()
    let timeOfDay

    const styles = {
    }

    if (hours <12){
        timeOfDay = "morning"
        styles.color = "#d9d610"
    }else if (hours >=12 && hours <=17){
        timeOfDay = "after noon"
        styles.color = "#d94452"
    } else{
        timeOfDay = "night"
        styles.color = "#2831d9"
    }

    if (loading) {
        return <div>Loading user data...</div>
    }

    if (error) {
        return <div>Error loading user data: {error.message}</div>
    }

    const userName = data?.me?.name || 'User';

    return (
        <div>
            <h1 style={styles}>Hello Good {timeOfDay}, {userName}!</h1>
            {data?.me && (
                <div style={{marginTop: '20px'}}>
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
                    {/* <div>
                        <strong>Email:</strong> {data.me.email}
                    </div>
                    <div>
                        <strong>User ID:</strong> {data.me.id}
                    </div> */}
                </div>
            )}
        </div>
    )
}
export default TimeOfDay