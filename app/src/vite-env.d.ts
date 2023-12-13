/// <reference types="vite/client" />

declare type HtmlProps<T extends HTMLElement, P extends {}> = Omit<React.HtmlHTMLAttributes<T> & P, `aria-${string}`>;
