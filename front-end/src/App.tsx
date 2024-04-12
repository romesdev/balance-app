
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";


function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/accounts')
  },[])


  return (
   <></>
  )
}

export default App
