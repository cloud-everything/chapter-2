import Styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className={Styles.container}>
      <div className={Styles.home} onClick={()=>{navigate("/")}}>Vishal book</div>
      <div>
        <div className={Styles.login} onClick={()=>{navigate("/login")}}>Login</div>
        <div className={Styles.signup} onClick={()=>{navigate("/signup")}}>signup</div>
      </div>
    </div>
  );
};

export default Navbar;
