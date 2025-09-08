import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { checkAuth, getCurrentUser } from "store/authSlice";
import Login from "pages/Login";
import Dashboard from "pages/Dashboard";
import DocumentUpload from "pages/DocumentUpload";
import DocumentList from "pages/DocumentList";
import DocumentCategories from "pages/DocumentCategories";
import CourseUpload from "pages/CourseUpload";
import CourseList from "pages/CourseList";
import CourseCategories from "pages/CourseCategories";
import NewsUpload from "pages/NewsUpload";
import NewsList from "pages/NewsList";
import NewsCategories from "pages/NewsCategories";
import Tests from "pages/Tests";
import Layout from "components/Layout";
import "./App.css";
import { LINKS } from "constants/routes.ts";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state: any) => state.auth,
  );

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      dispatch(checkAuth());
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user && user.role !== "admin") {
      localStorage.removeItem("auth_token");
      window.location.href = "/";
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path={LINKS.homeLink}
            element={<Navigate to="/dashboard" replace />}
          />
          <Route path={LINKS.dashboardLink} element={<Dashboard />} />
          <Route path={LINKS.documentsLink} element={<DocumentList />} />
          <Route
            path={LINKS.documentsUploadLink}
            element={<DocumentUpload />}
          />
          <Route
            path={LINKS.documentsCategoryLink}
            element={<DocumentCategories />}
          />
          <Route path={LINKS.coursesLink} element={<CourseList />} />
          <Route path={LINKS.coursesUploadLink} element={<CourseUpload />} />
          <Route
            path={LINKS.coursesCategoryLink}
            element={<CourseCategories />}
          />
          <Route path={LINKS.newsLink} element={<NewsList />} />
          <Route path={LINKS.newsUploadLink} element={<NewsUpload />} />
          <Route path={LINKS.newsCategoryLink} element={<NewsCategories />} />
          <Route path={LINKS.testsLink} element={<Tests />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
