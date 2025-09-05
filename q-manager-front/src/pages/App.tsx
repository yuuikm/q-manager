import { Route, Routes } from 'react-router-dom';
import Home from 'pages/Home';
import { links } from 'constants/links';
import Login from 'pages/Login';
import Register from 'pages/Register';
import Profile from 'pages/Profile';
import Documents from 'pages/Documents';
import DocumentDetail from 'pages/DocumentDetail';

function App() {
  return (
    <Routes>
      <Route path={links.home} element={<Home />} />
      <Route path={links.login} element={<Login />} />
      <Route path={links.register} element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path={links.documents} element={<Documents />} />
      <Route path="/documents/category/:category" element={<Documents />} />
      <Route path="/documents/view/:id" element={<DocumentDetail />} />
    </Routes>
  );
}

export default App;
