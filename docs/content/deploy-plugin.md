---
outline: deep
---

# Building and Publishing Your Visualization

Once your visualization is complete and ready for deployment to Galaxy, you can publish it to `npm` and [submit a pull](deploy-request) request to the Galaxy development repository.

## Configure the Package Name and Files

1. Open the `package.json` file in your project.
2. Update the `name` field to specify a unique package name.
3. Adjust the `version` field if needed.
4. Ensure that the following section is in your `package.json`:

```json
  "files": ["static"]
```

## Build the Package

To build your package to `npm`, run the following commands from your project’s root directory:

```bash
npm run build
```

## Publish to npm

Verify that the `static` directory includes your XML file, a logo.svg, bundled JavaScript and CSS files, and other assets as required.
To publish your package to npm, run the following command from your project’s root directory:

```bash
npm publish --access public
```
