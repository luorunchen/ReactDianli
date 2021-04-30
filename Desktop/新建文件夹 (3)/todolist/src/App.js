
import React from 'react'
import Title from './components/title/title.jsx'
import { BrowserRouter } from "react-router-dom";
import './App.css'
import Router from './router/Router'

//创建App类
class App extends React.Component {
  render() {
    return (
      <div className='App'>
        <BrowserRouter>
          {/* <Title /> */}

          <Router />
        </BrowserRouter>
      </div>
    );
  }
}


//暴露App类组件
export default App;
