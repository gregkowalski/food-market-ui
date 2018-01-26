This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Running

```bash
$ npm install
$ npm start
```

The server should be live at <http://localhost:3000>.

## Build 

The following command will bundle all the resources using react-scripts:

```bash
$ npm run build
```

## Deploy

In order to deploy the code to the appropriate AWS S3 bucket, you first need to ensure that you have the appropriate AWS credentials configured in your environment.  The following command deploys the dev environment:

```bash
$ npm run deploy
```

## Semantic-UI and Semantic-UI-React

### Install `semantic-ui` and `semantic-ui-react`

The following steps were done to install semantic-ui and semantic-ui-react but please note that this is for information only.  These packages are already installed so you do NOT need to run these commands.

```bash
$ npm install --save semantic-ui-react 
$ npm install --save-dev semantic-ui
```
Follow the prompts for the `semantic-ui` package, choosing the most customizable option, which saves to the project directory. Theme customization can be done in `semantic/src/theme.config` and `semantic/src/themes/`. See [the Semantic UI usage docs](http://react.semantic-ui.com/usage) for more information.

### Build and link the Semantic UI `dist/` files

Semantic UI uses the tool `gulp` to build. If you do not have it, you may want to [install it globally](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md). The following build steps must be done after every change to themes or other modifications to `semantic` itself.
```bash
$ npm run semantic:build
```

You can look into the `packages.json` file to see that it uses the following gulp command underneath in the semantic folder: `(cd semantic && gulp build)`.  The above `semantic:build` task also copied the output css and theme files to the `src/semantic` folder, which is then referenced from `src/index.js`.  We link the newly generated CSS file as a dependency into `src/index.js` so that [Webpack](https://webpack.github.io/) knows to bundle it:

In `src/index.js`, add:
```js
import 'semantic/semantic.min.css';
```

### Notes

- The swap-out process was very painless. ReactJS itself has great separation of concerns, and this framework respects that a lot. Aside from installing the libraries, there wasn't anything that had to be done outside of the component-specific file.
- Caveat: Now we have more configuration files/folders to manage, but as discussed above, this isn't necessary and is simply a decision in the trade-off between customizability and configuration simplicity.
- Caveat: Because `<input />` components are nested in the Semantic UI provided `<div></div>`s, [`ref=` properties](https://facebook.github.io/react/docs/refs-and-the-dom.html) on Semantic UI input elements will not work as intended. See discussions and workarounds in this thread: <https://github.com/Semantic-Org/Semantic-UI-React/issues/405>.
