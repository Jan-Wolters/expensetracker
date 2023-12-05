import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Auth } from "./contexts/Auth";
import { checkLogin } from "./api";
import { Home } from "./components/Home";

 
const RedirectToDashboard = () => <Navigate to="/" />;

const initIsLoggedIn = await checkLogin();
export const App = () => {
  return (    
    <Auth.Provider isLoggedIn={initIsLoggedIn}>
      <BrowserRouter>
    
        <Routes>
          <Route path="/" Component={Home} />
         
          <Route Component={RedirectToDashboard} />
        </Routes>
      </BrowserRouter>
    </Auth.Provider>
  );
};
