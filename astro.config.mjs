// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";
import { architectureCheck } from "./scripts/check-architecture.mjs";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [architectureCheck(), mdx(), sitemap(), react()],
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
});
