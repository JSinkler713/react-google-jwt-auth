import './App.css';
import { useEffect, useState } from 'react'
import queryString from "query-string";
import { useHistory, useLocation } from 'react-router-dom';

function App(props) {
  const [user, setUser] = useState()
  const history = useHistory()
  const location = useLocation()

  useEffect(()=> {
    console.log('use effect happened')
    var query = queryString.parse(location.search);
    if (query.token) {
      window.localStorage.setItem("jwtToken", `Bearer ${query.token}`);
      history.push("/");
   }
  }, [])

  const getProfileInfo = ()=> {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const token = localStorage.getItem('jwtToken')
    console.log(token)
    //add the jwt token to header
    myHeaders.append('Authorization', token);
    fetch(`http://localhost:8000/profile`, {
       method: 'GET',
       mode: 'cors',
       headers: myHeaders,
     })
     .then(response => {
       if (response.status == 200) {
         return response.json()
       } else {
         // jwt is expired or user not logged in
         localStorage.setItem('jwtToken', '')
         // make login again
         window.location.href = 'http://localhost:8000/auth/google'
       }
     })
     .then(data => {
       setUser(data)
     })
     .catch(error => {
       console.log('---> error in post')
       console.error(error)
     })
  }
  return (
    <div className="App">
      <p>Please login with google to be authenticated</p>
      <a className="button-label" href="http://localhost:8000/auth/google">Sign In with Google</a>
      <button className="button-label" onClick={getProfileInfo}>Get profile info</button>
    </div>
  );
}

export default App;
