import React from "react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../Pages/Auth/UserAuthContext";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const { logOut, user } = useUserAuth();

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/signin");
      return false;
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="sidebar">
        <h2>Foodie</h2>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/all-orders">Orders</Link>
          </li>
          <li>
            <Link to="/reciepes">Reciepes</Link>
          </li>
          <li>
            <Link to="/offers">Offers</Link>
          </li>

          <li>
            <Link to="/payments">Payments</Link>
          </li>

          <li>
            <Link to="/my-store">My Store</Link>
          </li>

          <li style={{ cursor: "pointer" }}>
            <a style={{ color: "red" }} onClick={handleLogout}>
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
