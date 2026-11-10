export const THEME_STORAGE_KEY = "dis-playground:theme";

export type ResolvedTheme = "light" | "dark";

export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
