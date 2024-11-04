# Connect to Galaxy

Galaxy Charts can be used to develop visualizations independently of Galaxy. However, to access Galaxy datasets, metadata, or run jobs, the visualization may need to connect to the Galaxy API.

To connect the Galaxy Charts standalone application to a Galaxy instance (either local or public), provide the following environment variables when running Galaxy Charts:

- **`GALAXY_KEY`**: Your Galaxy API key.
- **`GALAXY_ROOT`**: The Galaxy server URL e.g. `https://usegalaxy.org` for Galaxy main.

Run the following command, replacing `MY_API_KEY` and `MY_GALAXY_SERVER` with your own values:

```bash
GALAXY_KEY=MY_API_KEY GALAXY_ROOT=MY_GALAXY_SERVER npm run dev
```

## Making Requests to the Galaxy API

Once connected to Galaxy, you can make API requests by importing `GalaxyApi` as follows:

```javascript
import { GalaxyApi } from "galaxy-charts";

async function fetchGalaxyVersion() {
  try {
    const { response, data } = await GalaxyApi().GET("/api/version");
    console.log("API Version:", data);
  } catch (error) {
    console.error("Error fetching Galaxy version:", error);
  }
}

fetchGalaxyVersion();
```

`GalaxyApi` support `GET`, `POST` and `PUT` requests.

## How to Obtain an API Key

1. Go to your Galaxy instance and sign in.
2. Click on your username in the top navigation bar, then select **Preferences**.
3. Scroll down to the **Manage API Key** section to create and access your personal API key.

::: warning NOTE
Keep your API key secure, just like your login credentials.
:::
