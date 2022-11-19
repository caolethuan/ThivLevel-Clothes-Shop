import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { DataProvider } from './GlobalState'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BttopBtn from './components/mainpages/utils/bttopBtn/BttopBtn'
import Content from './Content'

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Content></Content>
          <ToastContainer />
          <BttopBtn />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
