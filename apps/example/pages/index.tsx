import { DatePicker } from "@react-shamsi/datepicker";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
export default function Home() {
  const [documentElement, setDocumentElement] = useState<HTMLElement>();
  useEffect(() => {
    const portalRoot = document.getElementById("calendar-thing");
    if (portalRoot) setDocumentElement(portalRoot);
  }, []);
  return (
    <div className={styles.container} id="calendar-thing">
      <div style={{ width: "20px" }}>
        <DatePicker calendarPortalElement={documentElement} />
      </div>
    </div>
  );
}
