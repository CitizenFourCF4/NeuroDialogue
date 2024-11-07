import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
 const { keycloak } = useKeycloak();
 const isLoggedIn = keycloak.authenticated;
  useEffect(()=>{
    const interval = setInterval(() => {
      const isLoggedIn = keycloak.authenticated
      if (!isLoggedIn) {
        keycloak.login();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isLoggedIn]);
 

 return isLoggedIn ? children : (<div></div>);
};

export default PrivateRoute;