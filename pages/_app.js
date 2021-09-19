// import '../styles/globals.css'
import { useEffect } from "react";
import "../styles/globals.css";
import { StoreProvider } from "../utils/Store";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <StoreProvider>
      <Component {...pageProps} />;
    </StoreProvider>
  );
}

export default MyApp;
