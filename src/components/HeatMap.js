import React from "react";
import keyboard from '../assets/keyboard.svg'
function HeatMap(props) {
  return (
    <>
        <img src={keyboard} style={{"width":`${props.width}px`,"height":`${props.height}px`,"paddingTop":"10vh"}} alt=""></img>
    </>
  );
}

export default HeatMap;
