## Mendix Unsaved Changes Message
Mendix widget to block the user from closing the browser, closing the tab, or clicking a Mendix navigation when they have unsaved changes.

*Note: the browser based message when the user tries to close the tab or close the browser CANNOT be customized. This was deprecated by most modern browsers.*

| Mendix Nav | Browser Close |  
| ------------- | ------------- |  
| ![mendix nav](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/mendix.png)   | ![browser close](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/browser.png)   |  

## Features
- Based on a boolean expression, dynamically enable the browsers onBeforeUnload event. 
- Based on a boolean expression, on any Mendix navigation execute a flow.
- Based on a boolean expression, block any Mendix navigation with a confirmation message.
- Tested and works in Chrome, Safari, Microsoft Edge, and Firefox

## Limitations
- Does not detect browser back or forward buttons 
  - Willing to add this functionality if anyone can find a way in Mendix
- The developer must manually track if the form has changes using onChange actions
  - Willing to automate this process if there is a good, future-proof method

## Usage
![config](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/config.png)  
1. Create a non-persistent helper object with a hasChanges boolean  
![entity](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/entity.png)  
2. Add a data view that returns the helper to your form that wraps your input data view  
3. Add the Unsaved Changes Message widget inside your form's data view and set the Block Exit expression 
![page](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/page.png)  
4. On each input widget, add an on-change action that sets hasChanges to true  
![onchange](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/onChange.png)  

### Observe Mode - Browser
*Only prevents Browser close and tab close*  
5. All set! Run the project, make some changes and attempt to close the browser tab  
- Debug mode will show you in the UI when the widget's Block Exit flag is enabled/disabled. It will also log useful information to the browser console. 
6. TURN OFF DEBUG MODE!

### Observe Mode - Mendix & Both
5. Set/Copy the Watching Class Name to all containers & buttons that you want to block (i.e. cancel button, layout's navigation list, etc)  

| Navigation in layout | Cancel button |  
| ------------- | ------------- |  
| ![navigation](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/navigation.png)   | ![cancel](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/cancel.png)   |  
  
*Note: the Navigation Menu class should be the class on the navigation menu itself while the Sidebar class should be the class on the highest level of that layout section. These are used to find the navigation menu and the sidebar in the DOM and adds a watcher for when the menu is opened and closed. If you do not have a collapsable menu, you do not need Navigation Menu or Sidebar Class*. 

![sidebar](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/sidebar.png)  
*Sidebar Class*
  
6. Set the On Process action as either a Microflow or a Nanoflow that performs a rollback on your form object. If you're using a non-persistent form object, then you might need to delete the objects. 
![OnProceed](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/OnProceed.png)  
7. All set! Run the project, make some changes. 
  - With debug mode on, you will see any content found using your configured Watching Class Name has a red box on top of it. It will also log useful information to the browser console.  
8. TURN OFF DEBUG MODE!  


## Demo project
https://widgettesting105-sandbox.mxapps.io/p/unsaved-changes-message

## Issues, suggestions and feature requests
https://github.com/bsgriggs/mendix-onBeforeUnload

## Development and contribution
Benjamin Griggs @2023
