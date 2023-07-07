
import MultiStepForm from "./components/MultiStepForm"
import { BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import './App.css'
import LoginForm from "./components/LoginForm";
import {useCookies} from 'react-cookie';
import Error from "./components/Error";
function App() {
  const[cookies,setCookies]=useCookies(["auth_token"]);

  return (
    <>
    
    <Router>
      <Routes>
        <Route path="/" Component={LoginForm} />
        {/* <Route path="/form" Component={MultiStepForm} /> */}

  <Route path="/form" Component={cookies.auth_token?MultiStepForm:Error} />

       
      
      </Routes>
    </Router>

    </>
  )
}

export default App
