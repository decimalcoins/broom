import "./globals.css";
import { AppProvider } from "@/context/AppContext";
export { metadata } from "./layout";

export default function Root({ children }) {
  return <AppProvider>{children}</AppProvider>;
}
