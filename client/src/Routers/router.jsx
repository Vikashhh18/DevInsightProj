import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import About from "../components/About";
import Feature from "../components/Features";
import Contact from "../components/Contact";
import Github from "../components/Github";
import Leetcode from "../components/Leetcode";
import Linkdin from "../components/Linkdin";
import Deshboard from "../pages/Deshboard";
import { RedirectToSignIn, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import AuthRedirect from "../components/AuthRedirect";
import Resume from "../components/Resume";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "features", element: <Feature /> },
      { path: "contact", element: <Contact/> },
      { path: "github", element: <Github/> },
      { path: "leetcode", element: <Leetcode/> },
      { path: "linkedin", element: <Linkdin/> },
      {path:"resume-analyzer",element:<Resume/>},
      {
  path: "dashboard",
  element: (
    <AuthRedirect>
      <Deshboard/>
    </AuthRedirect>
  ),
}
    ],
  },
]);

export default router;
