import { useState } from 'react'
import Tank from './Components/Tank'
import './index.css'
import Box from './Components/Box'

function App() {
  const [isShow, setIsShow] = useState(true)
  return (
    <div className='relative flex w-full h-full justify-center items-center'>
          {
            isShow ? 
            <Tank isShow={isShow} setIsShow={setIsShow}/>
            :
            <Box isShow={isShow} setIsShow={setIsShow} />
          }
    </div>
  )
}

export default App
