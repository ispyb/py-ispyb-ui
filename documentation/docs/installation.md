## Installation

As dependency be sure you get **git** and **npm** (>6.14) installed in your computer

Check out the repository

```bash
git clone https://github.com/ispyb/py-ispyb-ui

```

Install the dependencies

```bash
cd py-ispyb-ui
npm install
```

## Configuration

Configuration is defined in `src/config`.
There, you will find different configuration presets which you can enable with the environment variable `REACT_APP_ISPYB_ENV`.

Currently, we have the following presets:

  - `default.ts` connection to a python server on `http://localhost:8000`
  - `netlify.ts` used by automatic preview deployment from the CI. Defines various sites for tests.
  - `esrf.ts` connecting to the python and java servers at ESRF.

The `config.ts` file defines what value the environment variable should have to use each configuration preset.

Feel free to add a new configuration file for your site using these as templates. You can configure it to connect to your java and/or python instances of ispyb.


## Run

!!! tip
Before running py-ispyb-ui you need to configure it correctly. Check the configuration section for details.

In order to run py-ispyb-ui for development you can type:

```
npm start
```

That will open py-ispyb-ui in a browser on http://localhost:3000

You can also create an optimized production build by typing:

```
npm run build
serve -s build
```
