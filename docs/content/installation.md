# Adding New Visualizations to Galaxy

To get started, we recommend cloning the [Galaxy Visualizations repository](https://github.com/galaxyproject/galaxy-visualizations). While cloning this repository isn't strictly necessary to add new visualizations to Galaxy, it's best practice to keep a central collection of all visualizations here for easy access and management.

Run the following command to clone the Galaxy Visualizations repsoitory:
```md
git clone https://github.com/galaxyproject/galaxy-visualizations
```

Once cloned, navigate to the packages subdirectory. This is where we will add a new visualization.
```md
cd galaxy-visualizations/packages
```

Ensure the degit tool is installed.

```md
npm install -g degit
```

Then use it to copy the [galaxy-charts-starter](https://github.com/guerler/galaxy-charts-starter) kit, specifying the desired name for your visualization plugin.

```md
degit https://github.com/guerler/galaxy-charts-starter MY_VISUALIZATION
```

Now is the right time to create your own github feature branch containing your visualization.

```md
git checkout -b MY_BRANCH
git add MY_VISUALIZATION
```

Navigate to your newly created plugin directory, and run:

```md
cd MY_VISUALIZATION
npm install
npm run dev
```

Your development environment is now set up and ready for customization!

Once you have completed adding your visualization or properly embedding a 3rd party plugin for integration with Galaxy, continue by pushing your changes to [github](https://docs.github.com) and issue a pull request.
