import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import { useContext, useEffect } from "react";
import NotFound from "./components/NotFound";
import { ResearchContext } from "./context/ContextProvider";
import { checkUserAuthenticate } from "./auth/auth";

function App() {
  const { userToken, setUserToken } = useContext(ResearchContext);
  useEffect(() => {
    checkUserAuthenticate(setUserToken);
  }, []);
  return (
    <div className="App" style={{ backgroundColor: "#C8D7F4" }}>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={userToken ? <Home /> : <Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
