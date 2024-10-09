import "./navbar.css";
import { FaAlignJustify, FaRegUser } from "react-icons/fa6";
import { FaSearch, FaYoutube, FaBell } from "react-icons/fa";
const Navbar = () => {
  return (
    <nav>
      <div className="nav-left flex-div">
        <FaAlignJustify className="menu" />
        <FaYoutube className="logo" />
      </div>
      <div className="nav-middle flex-div">
        <div className="search-box flex-div">
          <FaSearch />
          <input type="text" id="search" placeholder="Search" />
        </div>
      </div>

      <div className="nav-right flex-div ">
        <FaBell className="notification" />
        <FaRegUser className="user" />
      </div>
    </nav>
  );
};

export default Navbar;
