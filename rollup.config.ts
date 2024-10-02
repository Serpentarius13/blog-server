import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { type RollupOptions } from "rollup";

const config: RollupOptions = {
  input: "index.ts",

  output: {
    file: "dist/index.js",
    format: "cjs",
  },

  plugins: [
    json(),
    nodeResolve({
      mainFields: ["module", "main"],
      extensions: [".js", ".ts", ".json", ".tsx"],
      preferBuiltins: false,
    }),
    typescript(),
    commonjs(),
  ],
};

export default config;
