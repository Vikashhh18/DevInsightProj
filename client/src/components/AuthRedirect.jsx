import { useUser, SignIn } from "@clerk/clerk-react";
import { useState } from "react";

const AuthRedirect = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();
  //  const [isSignIn, setIsSignIn] = useState(true);


  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
        <div className="flex items-center justify-center min-h-screen  bg-gray-100">
      <div className="text-center">
          <SignIn/>
      </div>
    </div>
    );
  }

  return children;
};

export default AuthRedirect;
