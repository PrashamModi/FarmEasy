import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedPage from "./components/ProtectedPage";
import Spinner from "./components/Spinner";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ProductInfo from "./pages/ProductInfo";

function App() {
  const {loading} = useSelector(state => state.loaders)
  return <div>
    {loading && <Spinner />}
    <Router>
      <Routes>
        <Route  exact path="/" element = {<ProtectedPage><Home /></ProtectedPage>} />
        <Route  exact path="/product/:id" element = {<ProtectedPage><ProductInfo /></ProtectedPage>} />
        <Route  exact path="/profile" element = {<ProtectedPage><Profile /></ProtectedPage>} />
        <Route  exact path="/admin" element = {<ProtectedPage><Admin /></ProtectedPage>} />
        <Route path="/login" element = {<Login />} />
        <Route path="/register" element = {<Register />} />
      </Routes>
    </Router>
  </div>;
}

export default App;
