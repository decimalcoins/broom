import "./globals.css";
import { PiProvider } from "@/context/PiContext";
export { metadata } from "./layout";

export default function Root({ children }) {
  return <PiProvider>{children}</PiProvider>;
}
