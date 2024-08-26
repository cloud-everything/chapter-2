import './App.css'
import Home from './components/core/Home'
import Login from './components/core/Login'
import SignUp from './components/core/SignUp'
import { Route,Routes } from 'react-router-dom'
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login></Login>}/>
        <Route path="/signup" element={<SignUp></SignUp>}/>
      </Routes>
    </>
  )
}

export default App
