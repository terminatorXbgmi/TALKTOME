import React, { useContext } from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatpage";
import "./App.css";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom";
import { ChatContext, ChatState } from "./Context/ChatProvider";

const App = () => {  
  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/" component={Homepage} exact />
        <PrivateRoute component={Chatpage} path="/chats" exact />
      </BrowserRouter>
    </div>
  );
};

const PrivateRoute = ({ children, ...rest }) => { 
  return (
    <Route {...rest}>{!ChatState().user ? <Redirect to="/" /> : children}</Route>
  );
};

export default App;
