import { Route, Routes } from 'react-router-dom';
import Home from 'pages/Home';
import { ROUTES } from 'constants/routes';
import Login from 'pages/Login';
import Register from 'pages/Register';
import Profile from 'pages/Profile';
import Documents from 'pages/Documents';
import DocumentDetail from 'pages/DocumentDetail';
import News from 'pages/News';
import NewsDetail from 'pages/NewsDetail';
import Courses from 'pages/Courses';
import CourseDetail from 'pages/CourseDetail';
import Checkout from 'pages/Checkout';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />
      <Route path={ROUTES.DOCUMENTS} element={<Documents />} />
      <Route path={ROUTES.DOCUMENT_CATEGORY} element={<Documents />} />
      <Route path={ROUTES.DOCUMENT_DETAIL} element={<DocumentDetail />} />
      <Route path={ROUTES.NEWS} element={<News />} />
      <Route path={ROUTES.NEWS_DETAIL} element={<NewsDetail />} />
      <Route path={ROUTES.COURSES} element={<Courses />} />
      <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetail />} />
      <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
    </Routes>
  );
}

export default App;
