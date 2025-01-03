# Weather dashboard made using React + NodeJS + Open source weather API (https://www.weatherapi.com/)

The proxy API for the actual weather API is in the server folder which is made with ExpressJS, for caching I have used the library
called as Node-Cache.

## Available Scripts

In the project directory, you can run:

### `npm start`

This will start the frontend, when using codespaces this is executed automatically.

### `cd server`
### `node server.js`

This will start the backend server, right now the URL for the API is of the github codespace machine,
it can also be modified to localhost:5000 in future.

I have not committed any .env files or node_modules to the repo, the API_KEY is with me and to run this project on your local you will either
need my key or create your own API key from https://www.weatherapi.com/ and add it in a .env file inside the server folder as WEATHERAPI_API_KEY = API_KEY.

I have also used browsers geolocation API which uses users latitude and longitude to fetch the weather if the user has given
permissions to use it. The icons for the weather conditions have also been implemented.

I am attaching a video demo of the project.

[Demo.webm](https://github.com/user-attachments/assets/6b85c784-896d-4443-aa09-2878f124388a)
