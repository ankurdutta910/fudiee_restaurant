import { Route, Routes } from "react-router-dom";
import "./App.css";
import Sidebar from "./Files/Components/Sidebar";
import Dashboard from "./Files/Pages/Dashboard";
import MyStore from "./Files/Pages/Restaurant/MyStore/MyStore";
import Login from "./Files/Pages/Auth/Login";
import ProtectedRoute from "./Files/Pages/Auth/ProtectedRoute";
import { UserAuthContextProvider } from "./Files/Pages/Auth/UserAuthContext";
import { ToastContainer } from "react-toastify";
import AddItem from "./Files/Pages/Restaurant/Reciepes/AddItem";
import Menu from "./Files/Pages/Restaurant/Reciepes/Menu";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <UserAuthContextProvider>
        <Routes>
          <Route
            path="/auth"
            element={
              <>
                <Login />
              </>
            }
          />

          <Route
            path="/"
            element={
              <>
                <ProtectedRoute>
                  <Sidebar />
                  <Dashboard />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/my-store"
            element={
              <>
                <ProtectedRoute>
                  <Sidebar />
                  <MyStore />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/reciepes"
            element={
              <>
                <ProtectedRoute>
                  <Sidebar />
                  <Menu />
                </ProtectedRoute>
              </>
            }
          />

          <Route
            path="/add-item"
            element={
              <>
                <ProtectedRoute>
                  <Sidebar />
                  <AddItem />
                </ProtectedRoute>
              </>
            }
          />
        </Routes>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
