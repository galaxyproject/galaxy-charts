---
title: Submit a Pull Request to Galaxy
description: Submit your plugin as a pull request to the Galaxy repository.
---

With your plugin published to `npm`, the next step is to submit a pull request to the Galaxy development repository.

## Step 1: Fork and Clone the Galaxy Repository

Fork the Galaxy repository available at [Galaxy Project on GitHub](https://github.com/galaxyproject/galaxy) and clone it to your local machine.

## Step 2: Register Your Plugin

In the Galaxy root directory, open `client/visualizations.yml` and add the name and package details of your plugin to the list.

## Step 3: Run Galaxy and Test Your Plugin

1. **Start Galaxy** by running the following command:

    ```bash
    ./run.sh
    ```

2. **Upload a test file** to your Galaxy history, ensuring it has the correct data type for your plugin.

3. **Open your plugin** from the Activity Bar to view and test your uploaded dataset.

## 🎉 Thank you for your contribution!

Following these steps will prepare your plugin for integration with Galaxy. Once everything is set up, you can open your pull request against Galaxy's `dev` branch.
