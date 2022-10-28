import "@react-shamsi/calendar/dist/index.css";
import "@react-shamsi/calendar/dist/styles.css";
import "@react-shamsi/datepicker/dist/styles.css";
import "@react-shamsi/timepicker/dist/styles.css";
import type { AppProps } from "next/app";
import "../styles/globals.css";
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
