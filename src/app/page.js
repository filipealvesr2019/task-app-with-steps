import Image from "next/image";
import styles from "./page.module.css";
import TasksPage from "@/Pages/Task";

export default function Home() {
  return (
    <div className={styles.page}>
      <TasksPage />
    </div>
  );
}
