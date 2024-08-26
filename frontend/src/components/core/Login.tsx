import { useState } from "react"
import Navbar from "./Navbar"


const Login = () => {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  
  const login=async()=>{
    console.log(email,password)
  }

  return (
    <div>
        <Navbar></Navbar>
        <div>
            <div>
              <label>email</label>
              <input type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
            </div>
            <div>
              <label>password</label>
              <input type="password"  value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
            </div>
            <button type="submit" onClick={login}>Login</button>
        </div>
    </div>
  )
}

export default Login