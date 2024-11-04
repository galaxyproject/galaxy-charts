---
outline: deep
---

# Building and Publishing Your Visualization

Once your visualization is complete and ready for deployment to Galaxy, you can publish it to `npm` and submit a pull request to the Galaxy development repository. This pull request should include the `XML Wrapper` and, optionally, a logo file in `png` or `svg` format.

## Configure the Package Name

1. Open the `package.json` file in your project.
2. Update the `name` field to specify a unique package name.
3. Adjust the `version` field if needed.

## Build and Publish to npm

To build and publish your package to `npm`, run the following commands from your project’s root directory:

```bash
npm run build
npm publish
```