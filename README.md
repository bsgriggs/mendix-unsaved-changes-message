## OnBeforeUnload
Dynamically trigger the browser's onBeforeUnload event and show a blocking message of unsaved changes when the user attempts to close the browser tab or the entire browser. Can be used together with the Unsaved Changes Message module to more robustly warn the user of their unsaved changes on navigation within Mendix.

## Features
- Based on a boolean expression, dynamically enable the browsers onBeforeUnload event. 

## Limitations
- Does not detect browser back or forward buttons 
  - I would be willing to add this functionality if anyone can find a way

## Usage
[step by step instructions]

## Demo project
[link to sandbox]

## Issues, suggestions and feature requests
[link to GitHub issues]

## Development and contribution

1. Install NPM package dependencies by using: `npm install`. If you use NPM v7.x.x, which can be checked by executing `npm -v`, execute: `npm install --legacy-peer-deps`.
1. Run `npm start` to watch for code changes. On every change:
    - the widget will be bundled;
    - the bundle will be included in a `dist` folder in the root directory of the project;
    - the bundle will be included in the `deployment` and `widgets` folder of the Mendix test project.

[specify contribution]
