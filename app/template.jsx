import "./globals.css";
import { AppProvider } from "@/context/PiContext";
export { metadata } from "./layout";

export default function Root({ children }) {
  return <AppProvider>{children}</AppProvider>;
}
