import React, { useEffect } from "react";
import useScript from "../hooks/useScript";

const GoogleLoginComponent = () => {
  const status = useScript("https://apis.google.com/js/platform.js");

  useEffect(() => {
    if (status === "ready") {
      window.gapi.load("auth2", () => {
        const auth2 = window.gapi.auth2.init({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        });
        attachSignin(document.getElementById("googleSignInButton"), auth2);
      });
    }
  }, [status]);

  const attachSignin = (element, auth2) => {
    auth2.attachClickHandler(element, {},
      (googleUser) => {
        console.log("Login Success:", googleUser.getBasicProfile());
      }, (error) => {
        console.log("Login Failed:", error);
      }
    );
  };

  return (
    <div>
      <div id="googleSignInButton">Login with Google</div>
    </div>
  );
};

export default GoogleLoginComponent;
