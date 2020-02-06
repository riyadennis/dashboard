import React from "react";

function TimeOfDay(){
    const date = new Date()
    const hours = date.getHours()
    let timeOfDay

    const styles = {
        color: "#FF8CC0",
        backgroundColor: "#FFF000",
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

    return (
        <h1 style={styles}>Hello Good {timeOfDay}</h1>
    )
}
export default TimeOfDay