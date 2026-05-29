import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import AfforditPrototype from "./App.jsx";
import "./styles.css";
import "./home-refresh.css";

function AfforditApp() {
  useEffect(() => {
    function skipDuplicateLogin(event) {
      const button = event.target?.closest?.("button");
      if (!button) return;

      const isContinue = button.textContent?.trim() === "Continue";
      const isLanding = Boolean(document.querySelector('img[src="/affordit-theme.png"]'))
        && document.body.textContent.includes("Already have an account?");

      if (!isContinue || !isLanding) return;

      const loginButton = [...document.querySelectorAll("button")].find((node) =>
        node.textContent?.trim() === "Log in"
      );

      if (!loginButton) return;
      event.preventDefault();
      event.stopPropagation();
      loginButton.click();
    }

    document.addEventListener("click", skipDuplicateLogin, true);
    return () => document.removeEventListener("click", skipDuplicateLogin, true);
  }, []);

  return <AfforditPrototype />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AfforditApp />
  </React.StrictMode>,
);