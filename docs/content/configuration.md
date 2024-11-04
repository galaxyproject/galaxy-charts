# Connect to Galaxy

Galaxy Charts can be used to develop visualizations independently of Galaxy. However, to access Galaxy datasets, metadata, or run jobs, the visualization may need to connect to the Galaxy API.

To connect the Galaxy Charts standalone application to a Galaxy instance (either local or public), provide the following environment variables when running Galaxy Charts:

- **`GALAXY_KEY`**: Your Galaxy API key.
- **`GALAXY_ROOT`**: The Galaxy server URL e.g. `https://127.0.0.1:8080` for a locally running Galaxy.

Run the following command, replacing `MY_API_KEY` and `MY_GALAXY_SERVER` with your own values:

```bash
GALAXY_KEY=MY_API_KEY GALAXY_ROOT=MY_GALAXY_SERVER npm run dev
```

## How to Obtain an API Key

1. Navigate to your Galaxy instance and sign in.
2. Click on your username in the top navigation bar and select Preferences.
3. Scroll down to Manage API Key to create and access your personal API key.

**Note: Treat your API key as securely as your login credentials.**