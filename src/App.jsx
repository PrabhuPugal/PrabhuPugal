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
import Research from "./pages/Research";
import Projects from "./pages/Projects";
import Photos from "./pages/Photos";
import "./styles/global.css";

export const sections = [
  { id: "home",       path: "/",           label: "Home",       component: Home },
  { id: "about",      path: "/about",      label: "About",      component: About },
  { id: "experience", path: "/experience", label: "Experience", component: Experience },
  { id: "research",   path: "/research",   label: "Research",   component: Research },
  { id: "projects",   path: "/projects",   label: "Projects",   component: Projects },
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
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
