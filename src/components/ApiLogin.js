import axios from "axios";

function ApiLogin(state, props){
    axios.post('http://localhost:8081/login/',
        {
            email: state.email,
            password: state.password
        },{
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
        .then(function (response) {
            props.handler(response.data)
        })
        .catch(function (error) {
            HandleError(error)
            console.log(error.config);
        });
}

function HandleError(error){
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

export default ApiLogin