import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";
import babel from "rollup-plugin-babel";
import path from "path";
import postcss from "rollup-plugin-postcss";

export default [
  {
    input: "src/main.js",
    output: {
      name: "SmartBack",
      file: pkg.browser,
      format: "umd",
    },
    plugins: [
      postcss({
        extract: path.resolve("dist/smart-back.min.css"),
        minimize: true,
      }),
      resolve(),
      commonjs(),
      babel({
        exclude: "node_modules/**",
      }),
    ],
  },
  {
    input: "src/main.js",
    external: [],
    output: [{ file: pkg.main, format: "es" }],
    plugins: [
      postcss({
        extract: path.resolve("dist/smart-back.min.css"),
        minimize: true,
      }),
    ],
  },
];
