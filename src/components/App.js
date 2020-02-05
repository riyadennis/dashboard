import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import Content from "./Content";
import Footer from "./Footer"
import Header from "./Header";

class App extends React.Component{
    render(){
        return(
            <div style={{textAlign: "justify"}}>
                <Header/>
                <Content/>
                <Footer/>
            </div>
        )
    }
}
export default App