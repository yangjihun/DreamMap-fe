import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import PrivateRoute from "@/components/PrivateRoute";
import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import UploadPage from "@/pages/UploadPage";
import AnalysisPage from "@/pages/AnalysisPage";
import RoadmapPage from "@/pages/RoadmapPage";
import ResumeDetailPage from "@/pages/ResumeDetailPage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
        <Routes>
            {/* 로그인이 필요 없는 공용 경로*/}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* 로그인이 필요한 보호된 경로                       */}
            {/* PrivateRoute가 이 경로들에 대한 접근을 제어*/}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadPage />} />
              {/* ':id'와 같은 동적 경로도 보호할 수 있다. */}
              <Route path="/analysis/:id" element={<AnalysisPage />} />
              <Route path="/roadmap/:id" element={<RoadmapPage />} />
              <Route path="/resume/:id" element={<ResumeDetailPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
