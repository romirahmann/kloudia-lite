import { RouterProvider } from "@tanstack/react-router";
import { LoginPage } from "./pages/Auth/LoginPage";
import { AuthProvider } from "./store/AuthContext";
import { router } from "./routes/Routes";

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
