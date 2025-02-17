## Mendix Unsaved Changes Message
Mendix widget to block the user from closing the browser, closing the tab, or clicking a Mendix navigation when they have unsaved changes.

*Note: the browser based message when the user tries to close the tab or close the browser CANNOT be customized. Most modern browsers deprecated this to mitigate malicious spam.*

| Mendix Nav | Browser Close |  
| ------------- | ------------- |  
| ![mendix nav](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/mendix.png)   | ![browser close](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/browser.png)   |  

## Features
- Based on a boolean expression, dynamically enable the browsers onBeforeUnload event. 
- Based on a boolean expression, on any Mendix navigation execute a flow.
- Based on a boolean expression, block any Mendix navigation with a confirmation message.
- Tested and works in Chrome, Safari, Microsoft Edge, and Firefox
- Mode 'JavaScript Action' provided in the module that provides better UX

## Limitations
- Does not detect browser back or forward buttons 
  - Willing to add this functionality if anyone can find a way in Mendix
- The developer must manually track if the form has changes using onChange actions
  - Willing to automate this process if there is a good, future-proof method

## Config
The following sections are all the settings of the widget. For more info on how to use these settings, see the Usage section.  
### General
![general](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/general.png)  
### Mendix Observe Mode Settings
![mendixObserveModeSettings](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/mendixObserveModeSettings.png)  
### Text
![text](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/text.png)  
### Actions
![actions](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/actions.png)  

## Usage
1. Create a non-persistent helper object with a hasChanges boolean  
![entity](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/entity.png)  
2. Add a data view that returns the helper to your form that wraps your input data view  
3. Add the Unsaved Changes Message widget inside your form's data view and set the Block Exit expression  
![page](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/page.png)  
4. On each input widget, add an on-change action that sets hasChanges to true  
![onchange](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/onChange.png)  
5. Consult the Decision Tree below and choose a path:  
![dTree](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/observeDTree.png)  

### Observe Mode - Browser
*Only prevents Browser close and tab close*  
6. All set! Run the project, make some changes, and attempt to close the browser tab  
7. TURN OFF DEBUG MODE! _Debug mode will show you in the UI when the widget's Block Exit flag is enabled/disabled. It will also log useful information to the browser console._  

### Observe Mode - Mendix - Class Names
*Only prevents in-app navigation for actions with one of the provided 'Watching Class List' classes. Does NOT get triggered with keyboard controls*  
6. Set/Copy the Watching Class Name 'unsaved-changes-block' to all containers & buttons that you want to block (i.e. cancel button, etc).  
![cancel](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/cancel.png)   
7. The Nav Menu Class List's default value should automatically detect all the items in the nav menu. But if you want to use the widget in a popup, remove these classes.  
8. Set the On Process action as either a Microflow or a Nanoflow that performs a rollback on your form object. If you're using a non-persistent form object, then you might need to delete the objects.  
![onProceed](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/OnProceed.png)  
9. All set! Run the project, make some changes to the form, and attempt to leave the page via one of the buttons you added the Watching Class Name on. 
10. TURN OFF DEBUG MODE! _With debug mode on, you will see any content found using your configured Watching Class Name has a red box on top of it. It will also log useful information to the browser console._  

### Observe Mode - Mendix & Both - JavaScript Action
*Only prevents in-app navigation for actions from Nanoflows that call the CheckUnsavedChangesMessage JavaScript Action*  
![javaScriptAction](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/javaScriptAction.png)  
6. The widget will make a callback function available to the browser. The JavaScript Action will call this function to check if any form's Unsaved Changes Message widget has Block Exit set to true.  
7. On _**ALL**_ actions that can leave your form (including the navigation menu, logout buttons, or anything else in the header that leaves the page), change these actions to a Nanoflow that FIRST calls the JavaScript Action. If the JavaScript Action returns true, there is nothing blocking the navigation.  
![exampleNavJSA](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/exampleNavJSA.png)  
8. All set! Run the project, make some changes to the form, and attempt to leave the page via one of the buttons you added the JavaScript Action on. 
9. TURN OFF DEBUG MODE! _With debug mode on, you will logs of useful information to the browser console (i.e. when the JavaScript Action was used)._  

## Demo project
https://widgettesting105-sandbox.mxapps.io/p/unsaved-changes-message/employees

## Issues, suggestions and feature requests
https://github.com/bsgriggs/mendix-unsaved-changes-message

## Development and contribution
Benjamin Griggs @2023
