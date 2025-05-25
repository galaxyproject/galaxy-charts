---
outline: deep
---

# Submit a Pull Request to Galaxy

With your visualization published to `npm`, the next step is to submit a pull request to the Galaxy development repository.

## Step 1: Fork and Clone the Galaxy Repository

Fork the Galaxy repository available at [Galaxy Project on GitHub](https://github.com/galaxyproject/galaxy) and clone it to your local machine.

## Step 2: Update the Gulpfile

In the Galaxy root directory, open `client/gulpfile.js` and add the name and package details of your visualization to the `VISUALIZATION_PLUGINS` list.

## Step 3: Run Galaxy and Test Your Visualization

1. **Start Galaxy** by running the following command:

    ```bash
    ./run.sh
    ```

2. **Upload a test file**  to your Galaxy history, ensuring it has the correct data type for your visualization.

3. **Open your visualization** from the Activity Bar to view and test your uploaded dataset.

## :tada: Thank you for your contribution!

Following these steps will prepare your visualization for integration with Galaxy. Once everything is set up, you can submit your pull request.