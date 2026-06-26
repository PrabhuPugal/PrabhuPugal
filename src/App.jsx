import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";
import ChatBubble from "./components/ChatBubble";
import ThemeToggle from "./components/ThemeToggle";
import ScrollToTop from "./components/ScrollToTop";
import GlobalEffects from "./components/GlobalEffects";
import Home from "./pages/Home";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Work from "./pages/Work";
import Photos from "./pages/Photos";
import PostDetail from "./pages/PostDetail";
import PaperViewer from "./pages/PaperViewer";
import "./styles/global.css";

export const sections = [
  { id: "home",       path: "/",           label: "Home",       component: Home },
  { id: "about",      path: "/about",      label: "About",      component: About },
  { id: "experience", path: "/experience", label: "Experience", component: Experience },
  { id: "work",        path: "/work",        label: "Work",        component: Work },
  { id: "lens",        path: "/lens",        label: "Lens",        component: Photos },
];

function AppInner() {
  const navigate = useNavigate();

  const handleSelectSection = (sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) navigate(section.path);
  };

  return (
    <>
      <ScrollToTop />
      <GlobalEffects />
      <CustomCursor />
      <ThemeToggle />
      <ChatBubble />
      <div className="appShell">
        <Navbar sections={sections} onSelectSection={handleSelectSection} />
        <div className="pageFlow">
          <Routes>
            {sections.map(({ id, path, component: Page }) => (
              <Route
                key={id}
                path={path}
                element={
                  <div className="sectionPage">
                    <Page onSelectSection={handleSelectSection} />
                  </div>
                }
              />
            ))}
            <Route path="/experience/:slug" element={<div className="sectionPage"><PostDetail type="experience" /></div>} />
            <Route path="/research/:slug"   element={<div className="sectionPage"><PostDetail type="research"   /></div>} />
            <Route path="/projects/:slug"   element={<div className="sectionPage"><PostDetail type="projects"   /></div>} />
            <Route path="/paper/:slug"      element={<PaperViewer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <footer className="siteFooter">
            © {new Date().getFullYear()} Prabhu Pugalenthi · HUMANS Lab @ USC
          </footer>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
