const esbuild = require("esbuild");

async function watch() {
  let ctx = await esbuild.context({
    entryPoints: ["./src/index.ts"],
    minify: false,
    sourcemap: true,
    outfile: "./dist/bundle.js",
    bundle: true,
    platform: "node",
    logLevel: "info",
    packages: "external",
    loader: { ".ts": "ts" },
  });
  await ctx.watch();
}
watch();