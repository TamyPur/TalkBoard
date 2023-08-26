// import * as ReactDOM from "react-dom";
import { Outlet } from 'react-router-dom'
import './App.css'
import { ForumList } from './components/ForumList'
import { Home } from './components/Home'
import { Login } from './components/Login'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
       <Login/>
       {/* <Outlet /> */}
    </>
  )
}

export default App
