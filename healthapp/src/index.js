//import the React and ReactDom libraries
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

//Get a reference to the div with root ID
const el = document.getElementById("root");

//Tell react to take control of the element using ReactDom library
const root = ReactDOM.createRoot(el);

//Show the componenet on screen
root.render(<App />);
