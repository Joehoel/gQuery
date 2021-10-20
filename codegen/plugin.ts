import { generate } from "@graphql-codegen/cli";
// import { fileURLToPath } from "url";

// import { buildSchema, printSchema, parse, GraphQLSchema } from "graphql";
// import * as fs from "fs";
// import * as path from "path";
// import * as typescriptPlugin from "@graphql-codegen/typescript";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const schema: GraphQLSchema = buildSchema(`type A { name: String }`);
const outputFile = "gquery.generated.ts";
// const config = {
//   documents: [],
//   config: {}, // used by a plugin internally, although the 'typescript' plugin currently  // returns the string output, rather than writing to a file
//   filename: outputFile,
//   schema: parse(printSchema(schema)),
//   plugins: [
//     // Each plugin should be an object
//     {
//       typescript: {}, // Here you can pass configuration to the plugin
//     },
//   ],
//   pluginMap: {
//     typescript: typescriptPlugin,
//   },
// };

const fileRegex = /\.(graphql)$/;

export default function levelupViteCodegen(options) {
  if (!options.schema) {
    throw new Error("No schema provided");
  }
  if (!options.output) {
    throw new Error("No output directory specified");
  }
  if (!options.gPath) {
    throw new Error(
      "No gPath directory specified. gPath is where you've initialized the 'g' client"
    );
  }

  const { schema, output, gPath } = options;

  return {
    name: "levelup-vite-codegen",

    async buildStart() {
      try {
        const generatedFiles = await generate(
          {
            schema,
            documents: "./src/**/*.graphql",
            generates: {
              [`${process.cwd()}/${output}/gquery-types.generated.ts`]: {
                plugins: ["typescript"],
              },
              [`${process.cwd()}/${output}`]: {
                config: {
                  gPath,
                },
                preset: "near-operation-file",
                presetConfig: {
                  extension: ".generated.ts",
                  folder: "./",
                  baseTypesPath: `gquery-types.generated.ts`,
                },
                plugins: [
                  "typescript-operations",
                  "@leveluptuts/g-query/codegen-plugin",
                ],
              },
            },
          },
          true
        );
      } catch (e) {
        console.log("❓ gFetch Warning - No `.graphql` files found.");
        console.log(
          "❓ gFetch Warning - If you would like the gQuery generator to work (we reccomend you do)."
        );
        console.log(
          "❓ gFetch Warning - If you would like to add them, you will need to restart SvelteKit."
        );
      }
      return;
    },

    transform(src, id) {},
  };
}