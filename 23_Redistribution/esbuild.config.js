import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["./test/index.ts"],
  bundle: true,
  platform: "neutral",
  outfile: "dist/script.js",
  external: ["k6", "k6/*"],
  mainFields: ["module", "main"],
}).catch(() => process.exit(1));