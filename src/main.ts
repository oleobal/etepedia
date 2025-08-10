import { mount } from 'svelte';
import App from "./App.svelte";


if (import.meta.env.VITE_IS_DEV === "true") {
    var link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = '/static/favicon-dev.png';
}

const app = mount(App, { target: document.body });

export default app;
