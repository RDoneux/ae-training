const esbuild = require("esbuild");

async function build() {
  await esbuild.build({
    entryPoints: ["./src/index.ts"],
    minify: true,
    sourcemap: false,
    bundle: true,
    platform: 'node',
    outfile: "./dist/bundle.js",
    logLevel: "error",
    packages: "external",
    loader: {".ts": "ts"}
  });
}

build();

console.log();
console.log();
console.log();
console.info("***************** BUILD COMPLETED *****************");
console.log();
console.log();