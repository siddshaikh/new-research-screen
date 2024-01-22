import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Home = React.lazy(() => import("./pages/Home"));
import NotFound from "./components/NotFound";
import { ResearchContext } from "./context/ContextProvider";
import { checkUserAuthenticate } from "./auth/auth";

function App() {
  const { userToken, setUserToken } = useContext(ResearchContext);
  let sessionValid = sessionStorage.getItem("user");
  if (!sessionValid) {
    localStorage.removeItem("user");
  }
  useEffect(() => {
    checkUserAuthenticate(setUserToken);
  }, []);

  return (
    <div className="bg-secondory">
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            userToken ? (
              <React.Suspense fallback={<div>Loading...</div>}>
                {" "}
                <Home />{" "}
              </React.Suspense>
            ) : (
              <Login />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
