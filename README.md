# WebApp Workspace Boilerplate

Angular & Nest integrated workspace managed without any third-party tools.

# Usage

## CLI

The CLIs of Angular and Nest still work in most cases, except application and library generation. We will talk about these exceptions below.

## Libraries

Angular and Nest have incompatible solutions about libraries. In order to share code between Angular and Nest projects, we have our own solutions driven by NPM and TypeScript.

Let's say we are going to create a library named `my-lib`.

Of course we need to create a directory named `my-lib` under `projects`. A `package.json` is required under `projects/my-lib`. This `package.json`'s responsibility is a bit different from the ones we meet in our daily development. Its only responsibility is to make this directory a `package`, so it doesn't specify dependencies or have scripts or owns anything other than `name`, `version` and `main`:

```json
{
  "name": "my-lib",
  "version": "0.0.0", // whatever version you want
  "main": "lib/index.js"
}
```

Then, create a `src` directory with an `index.ts` in it. To make the code in `src` compiled to `lib`, as specified in the `main` field in `package.json`, we need to create a `tsconfig.lib.json` in the same directory as `src`:

```json
{
  "extends": "../../tsconfig.lib.base.json",
  "compilerOptions": {
    "outDir": "./lib"
  }
}
```

Powered by TypeScript's feature [Project Reference](https://www.typescriptlang.org/docs/handbook/project-references.html#handbook-content), our build script will incrementally compile all the libraries specified in `/tsconfig.libs.json`(this file locates at the root of the workspace). So we should add our library to this root config:

```json
{
  "files": [],
  "references": [
    { "path": "./projects/ts-lib/tsconfig.lib.json" } // add our library here
  ]
}
```

We are almost there. To use these code from somewhere else, we need to `install` this directory to `node_modules` as a `local package`:

```sh
npm i projects/my-lib
```

This will create a symbol link at `node_modules/my-lib` referring to `projects/my-lib`, and add it as a dependency to the root `package.json` so that the symbol link will be automatically created when performing `npm i`.

Now our library will be available to other projects once we build them for the first time:

```sh
npm run build:libs
```

```ts
import { something } from 'my-lib';
```

But there are still some small problems:

- We cannot use the library without the first build.
- Auto-import will refer to `projects/my-lib/src` or `projects/my-lib/lib` instead of `my-lib`.

They are easy to resolve. We just need to add a TypeScript path mapping in `/tsconfig.common.json`(this file locates at the root of the workspae):

```json
{
  "compilerOptions": {
    // ...
    "paths": {
      "my-lib": ["projects/my-lib/src"] // add this
    }
  }
  // ...
}
```
