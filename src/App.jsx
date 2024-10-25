import { useState } from 'react';
import Header from './components/Header';
import Homepage from './Homepage';
import WelcomePage from './components/WelcomePage';


function App() {
  const [count, setCount] = useState(0)

  return (
    
      <div>
        <Header />
        <WelcomePage />
        </div>
  )
}

export default App
