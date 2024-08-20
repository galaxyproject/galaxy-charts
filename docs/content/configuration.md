# Connect to Galaxy

Galaxy Charts can be used to develop Visualizations independently of Galaxy. However, visualization may access to the Galaxy API in order to retrive datasets, metadata or run jobs. In the Galaxy Charts standalone application can be connected to the API of a local or public runnning Galaxy instance by providing the `GALAXY_API` route either as environment variable, when running Galaxy Charts:

```md
GALAXY_API="http://127.0.0.1:8081/api" yarn dev
```

or by specifying the corresponding route in the `server.config.js` file as show here:
```md
export default {
    GALAXY_API: "http://127.0.0.1:8081/api",
};
```
