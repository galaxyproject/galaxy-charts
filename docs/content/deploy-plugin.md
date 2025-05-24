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

## Build and Publish to npm

To build and publish your package to `npm`, run the following commands from your project’s root directory:

```bash
npm run build
npm publish --access public
```