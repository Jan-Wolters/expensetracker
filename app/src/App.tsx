import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Auth } from "./contexts/Auth";
import { checkLogin } from "./api";
import { Home } from "./components/Home";
import { Login } from "./components/LoginForm";
import { Dashboard } from "./components/Dashboard";
import { Navbar } from "./components/Navbar";

const RedirectToHome = () => <Navigate to="/" />;

const initIsLoggedIn = await checkLogin();

export const App = () => {
  return (
    <Auth.Provider isLoggedIn={initIsLoggedIn}>
      <BrowserRouter>
        <Navbar />
        <Routes>
         <Route path="/" Component={Home} />
         <Route path="/auth/Login" Component={Login}/>
          <Route path="/Home" Component={Dashboard}/>
          <Route path="/login" element={<RedirectToHome />} />
        </Routes>
      </BrowserRouter>
    </Auth.Provider>
  );
};

