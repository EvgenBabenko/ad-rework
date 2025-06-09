import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginImageCompress } from "@rsbuild/plugin-image-compress";

export default defineConfig({
  plugins: [pluginReact(), pluginImageCompress()],
  html: {
    template: "./src/index.html",
  },
  output: {
    assetPrefix: "/ad-rework/",
  },
});
