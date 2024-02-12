// Import the React and ReactDom libraries
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';


// Get a reference to the div with the root ID
const el = document.getElementById("root");

// Tell React to take control of the element using ReactDOM library
const root = ReactDOM.createRoot(el);

// Show the component on screen
root.render(<App />);
