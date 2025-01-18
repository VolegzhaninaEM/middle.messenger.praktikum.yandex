import { defineConfig } from "vite";
import { resolve } from "path";
import handlebars from "vite-plugin-handlebars";

const pageData = {
  "/": {
    title: "Main Page",
  },
  "/pages/signs/signIn.html": {
    title: "Sign In",
  },
  "/pages/signs/signUp.html": {
    title: "Sign Up",
  },
  "/pages/errors/404.html": {
    error: "404",
    message: "Page Not Found",
  },
  "/pages/errors/5xx.html": {
    error: "500",
    message: "We are already fixing it",
  },
};

export default defineConfig({
  root: resolve(__dirname, "src"),
  build: {
    outDir: resolve(__dirname, "dist"),
    assetsDir: "partials",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "/index.html"),
        signUp: resolve(__dirname, "/pages/signs/signUp.html"),
        signIn: resolve(__dirname, "/pages/signs/signIn.html"),
        chats: resolve(__dirname, "/pages/chats/chats.html"),
        "404": resolve(__dirname, "/pages/errors/404.html"),
        "5xx": resolve(__dirname, "/pages/errors/5xx.html"),
      },
    },
  },
  server: {
    port: 3000,
  },
  publicDir: resolve(__dirname, "static"),
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
        paths: ["src/pages"],
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src", "partials"),
      context(pagePath) {
        return pageData[pagePath];
      },
    }),
  ],
});
