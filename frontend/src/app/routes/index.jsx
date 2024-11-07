import { Route, Routes } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "src/app/keycloak/Keycloak";
import PrivateRoute from "./privateRoute";
import ChatPage from "src/pages/chat-page/ChatPage";
import NotFoundPage from "src/pages/page-not-found/NotFoundPage";

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
          <Route path="*" element={<NotFoundPage />}/>
        </Routes>
      </ReactKeycloakProvider>
    </div>
  )
}

export default Routing