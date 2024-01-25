//import the React and ReactDom libraries
import React from "react";
import ReactDOM from "react-dom/client";

//Get a reference to the div with root ID
const el = document.getElementById("root");

//Tell react to take control of the element using ReactDom library
const root = ReactDOM.createRoot(el);

//Create a componenet
function App() {
  return <h1>hello</h1>;
}

//Show the componenet on screen
root.render(<App />);
