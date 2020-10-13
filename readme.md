## Setting Up

1. Download and install [NodeJS](https://nodejs.org/en/download/).
2. Open console/cmd/terminal and navigate to current cloned directory.
3. For the first time only, run the following command
    ```javascript
    npm ci
    ```
4. Make sure to copy the JSON files in **source** directory.
5. Rename **.env_sample** to **.env** and update parameters value defined in it, where *AUTH_TOKEN* should contain the authentication token, and *API_URL* should have the API url where data will be sent.
6. Run the following command to start file sync
    ```javascript
    npm start
    ```

#### Notes
1. Errored files name will be created available in **./stats/error.json**.
2. Monitor and report data in file **./stats/report-error.json** if any to admin.
