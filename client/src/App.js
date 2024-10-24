import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { Provider } from "react-redux";
import store from './redux/store';
import Board from './components/Board';
import LoginPage from './components/LoginPage';
import AssignedTask from './components/AssignedTask';
import Demo from './components/Demo';
import Card from './components/Card';


function App() {
  return (
    <div className="App text-4xl">
      <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>} /> 
          <Route path="/mytask" element={<><Header/> <Board/></> } /> 
          <Route path="/assigned" element={<><Header/><Board/></>} /> 
          <Route path="/demo" element={<><Demo/></>} /> 
          <Route path="/card" element={<><Card/></>} /> 
        </Routes>
      </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
