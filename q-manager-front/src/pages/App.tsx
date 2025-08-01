import { Route, Routes } from 'react-router-dom';
import Home from 'pages/Home';
import { links } from 'constants/links';
import Login from 'pages/Login';
import Register from 'pages/Register';

function App() {
  return (
    <>
      <Routes>
        <Route path={links.home} element={<Home />} />
        <Route path={links.login} element={<Login />} />
        <Route path={links.register} element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
