import { useEffect, useState } from "react";
let preference: "light" | "dark" | undefined;
export function useSmartyColoursTheme() {
  const [theme, setTheme] = useState<"light" | "dark" | undefined>();
  useEffect(() => { const media = window.matchMedia("(prefers-color-scheme: dark)"); const update = () => setTheme(preference ?? (media.matches ? "dark" : "light")); update(); media.addEventListener("change", update); return () => media.removeEventListener("change", update); }, []);
  const toggle = () => { preference = theme === "dark" ? "light" : "dark"; setTheme(preference); };
  return { theme, toggle };
}
