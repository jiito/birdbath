import "../styles/globals.css";
import type { AppProps } from "next/app";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    const loadScript = function (src: string) {
      var tag = document.createElement("script");
      tag.src = src;
      var body = document.getElementsByTagName("body")[0];
      body.appendChild(tag);
    };

    loadScript("https://platform.twitter.com/widgets.js");
  }, []);
  return (
    <SessionProvider session={session}>
      <html className="bg-slate-800">
        <Component {...pageProps} />
      </html>
    </SessionProvider>
  );
}

export default MyApp;
