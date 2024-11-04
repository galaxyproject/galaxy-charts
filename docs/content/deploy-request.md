---
outline: deep
---

# Submit a Pull Request to Galaxy

With your visualization published to `npm`, the next step is to submit a pull request to the Galaxy development repository. This pull request should include your XML wrapper file and, optionally, a logo file in either `png` or `svg` format. 

Note: Replace `MY_VISUALIZATION` with your visualization name in the following instructions.

## Step 1: Fork and Clone the Galaxy Repository

Fork the Galaxy repository available at [Galaxy Project on GitHub](https://github.com/galaxyproject/galaxy) and clone it to your local machine.

## Step 2: Create a Branch for Your Visualization

Create a new branch specifically for your visualization:

```bash
git branch MY_VISUALIZATION
git checkout MY_VISUALIZATION
```

## Step 3: Set Up Your Visualization Directory

1. Create a directory for your visualization in the Galaxy repository at `config/plugins/visualizations/MY_VISUALIZATION`.

2. Copy the XML file (`MY_VISUALIZATION.xml`) generated during development into a subdirectory named config:

```plaintext
config/plugins/visualizations/MY_VISUALIZATION/config/MY_VISUALIZATION.xml
```

## Step 4: Verify XML Requirements and Data Sources

1. Ensure the `requirements` section in your XML file specifies the correct `npm` package name and version.
2. Confirm the `data_sources` section in the XML lists the appropriate datatype extension(s) compatible with your visualization.

## Step 5: Add an Optional Logo

Optionally, include a logo file (logo.svg or logo.png) for your visualization by placing it in a static subdirectory:

```plaintext
config/plugins/visualizations/MY_VISUALIZATION/static/logo.[svg/png]
```

## Step 6: Update the Gulpfile

In the Galaxy root directory, open `client/gulpfile.js` and add the name of your visualization to the `INSTALL_PLUGIN_BUILD_IDS` list.

## Step 7: Run Galaxy and Test Your Visualization

1. **Start Galaxy** by running the following command:

    ```bash
    ./run.sh
    ```

2. **Upload a test file**  to your Galaxy history, ensuring it has the correct data type for your visualization.

3. **Open your visualization** from the Activity Bar to view and test your uploaded dataset.


## :tada: Thank you for your contribution!

Following these steps will prepare your visualization for integration with Galaxy. Once everything is set up, you can submit your pull request.

