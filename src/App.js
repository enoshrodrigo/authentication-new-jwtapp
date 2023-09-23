import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import axios from 'axios';
 


function App() {
  const [username,setUsername] = useState(null);
  const [password,setPassword] = useState(null);
  const [Deleted,setDeleted] = useState(null);
  const [Error,setError] = useState(null);
  const [User,setUser] = useState(null);

 
const submit = async()=>{
const sub= await axios.post('http://localhost:5000/api/login',{username,password})
.then(response=>setUser(response.data))
.catch(e=>console.log(e))
}

const deleteUser = async()=>{
  const sub= await axios.delete('http://localhost:5000/api/users/'+User.id,{headers:{
    authorization:"Bearer "+User.accesToken},
    password})
  .then(response=>setDeleted(response.data))
  .catch(e=>setDeleted(e.response.data))
  }
  return (
    <div className="App">
      <header className="App-header"> 
{
  !User?(

         <div class="form-group">
           <label for="">User Name </label>
           <input type="text" class="form-control" name="" id="" aria-describedby="helpId" placeholder="" onChange={(e)=>{setUsername(e.target.value)}} />
            <br />
           <label for="" className=''>Password </label>
           <input type="text" class="form-control " name="" id="" aria-describedby="helpId" placeholder="" onChange={(e)=>{setPassword(e.target.value)}} />
           <br />
            <button onClick={submit}>Submit</button>
         </div>
  ):(
    <div>
      <h1>Welcome </h1>
      <button onClick={deleteUser}>Delete</button>
     {
      !Error?(
        <div>
        <h4>{Deleted}</h4>
        </div>
      ):(
        <div>
        <h4>User deleted unsuccesfully</h4>
          </div>
      )
     }
    </div>
  )
}
      </header>
    </div>
  );
}

export default App;
