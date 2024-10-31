import { Route, Routes } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "src/services/keycloak";
import ChatPage from "./chat-page/ChatPage";
import PageNotFound from "./page-not-found/NotFound";
import PrivateRoute from "src/helpers/privateRoute";

const Routing = () => {
  return(
    <div>
      <ReactKeycloakProvider authClient={keycloak}>
        <Routes>
          <Route path="/" element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
            }/>
          <Route path="*" element={<PageNotFound />}/>
        </Routes>
      </ReactKeycloakProvider>
    </div>
  )
}

export default Routing