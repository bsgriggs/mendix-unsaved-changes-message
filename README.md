## Mendix Unsaved Changes Message
Mendix widget to block the user from closing the browser, closing the tab, or clicking a Mendix navigation when they have unsaved changes.

> [!NOTE]  
> Note: the browser-based message when the user tries to close the tab or close the browser CANNOT be customized. Most modern browsers have deprecated this to mitigate malicious spam.

| Mendix Nav | Browser Close |  
| ------------- | ------------- |  
| ![demoMendix](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/demoMendix.png)   | ![demoBrowser](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/demoBrowser.png)   |  
| ![demoCustom](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/demoCustom.png)   |    |  

## Features
- Based on a boolean expression, dynamically enable the browser's onBeforeUnload event. 
- Based on a boolean expression, on any Mendix navigation, execute a flow.
- Based on a boolean expression, block any Mendix navigation with a confirmation message.
- Tested and works in Chrome, Safari, Microsoft Edge, and Firefox
- Mode 'JavaScript Action' provided in the module that provides a better UX, see [the Usage section of the ReadMe](https://github.com/bsgriggs/mendix-unsaved-changes-message?tab=readme-ov-file#usage)
- Ability to use a custom popup page, see [the Custom Popup section of the ReadMe](https://github.com/bsgriggs/mendix-unsaved-changes-message?tab=readme-ov-file#custom-popups)
- Debug mode based on a Server Constant 'CONST_DebugUnsavedChanges'

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
![observeClassNames](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/observeClassNames.png)  
### Popup
#### MxConfirmation
![popupConfirm](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/popupConfirm.png)  
#### Custom Popup
![popupCustom](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/popupCustom.png)  
### Actions
![actions](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/actions.png)  
### Common
![Common](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/Common.png)  

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
> [!NOTE]  
> Only prevents Browser close and tab close
6. All set! Run the project, make some changes to a record being tracked, and attempt to close the browser tab  
7. TURN OFF DEBUG MODE! _Debug mode will show you in the UI when the widget's Block Exit flag is enabled/disabled. It will also log useful information to the browser console._  

### Observe Mode - Mendix - Class Names
> [!NOTE]  
> Only prevents in-app navigation for actions with one of the provided 'Watching Class List' classes. Does NOT get triggered with keyboard controls
6. Set/Copy the Watching Class Name 'unsaved-changes-block' to all containers & buttons that you want to block (i.e., cancel button, etc).  
![cancel](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/cancel.png)   
7. The Nav Menu Class List's default value should automatically detect all the items in the default Mendix nav menus.
> [!IMPORTANT]  
> If you want to use the widget in a popup, remove the Nav menu Class List.  
8. Set the On Process action as either a Microflow or a Nanoflow that performs a rollback on your form object. If you're using a non-persistent form object, then you might need to delete the objects.  
![onProceed](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/OnProceed.png)  
9. All set! Run the project, make some changes to a record being tracked, and attempt to leave the page via one of the buttons you added the Watching Class Name. 
10. TURN OFF DEBUG MODE! _With debug mode on, you will see any content found using your configured Watching Class Name has a red box on top of it. It will also log useful information to the browser console._  

### Observe Mode - Mendix & Both - JavaScript Action
> [!NOTE]  
> Only prevents in-app navigation for actions from Nanoflows that call the `CheckUnsavedChangesMessage` JavaScript Action
![javaScriptAction](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/utils.png)  
6. The widget will make a callback function available to the browser. The JavaScript Action will call this function to check if any form's Unsaved Changes Message widget has Block Exit set to true. If there is unsaved changes, the JavaScript action will pause until the popup is resolved.   
7. On _**ALL**_ actions that can leave your form (including the navigation menu, logout buttons, or anything else in the header that leaves the page), change these actions to a Nanoflow that FIRST calls the JavaScript Action. If the JavaScript Action returns true, nothing is blocking the navigation.  
![exampleNavJSA](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/exampleNavJSA.png)  
8. All set! Run the project, make some changes to a record being tracked, and attempt to leave the page via one of the buttons you added the JavaScript Action. 
9. TURN OFF DEBUG MODE! _With debug mode on, you will log lots of useful information to the browser console (i.e., when the JavaScript Action was used)._  

## Custom Popups
1. Create a Mendix page for informing the user of unsaved changes. See the Nanoflows for each action below.  
![customPopup_studioPro](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/customPopup_studioPro.png)  
2. Set the page's close action to one of the buttons. Preferably, the button that keeps the user on the page to continue making changes. Out-of-the-box, Mendix will have the _escape_ key trigger the page's close action. The page's close action refers to the 'X' button in the top-right of all popups.
3. **ALL** buttons on the popup **MUST be a Nanoflow** that ends with the `SetUnsavedMessageOutcome` JavaScript action. This action informs the widget that the popup has closed and to either proceed or cancel the navigation away from the page.  
![javaScriptAction](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/utils.png)

> [!Important]  
> Failure to include the `SetUnsavedMessageOutcome` JavaScript action will negatively affect performance. The browser will continue checking the outcome flag indefinitely. 

### Save and Leave
1. Saves the record. The Microflow returns `TRUE` if the Country was valid.
2. Close the custom confirmation popup.
3. If it was valid, set the `proceed` outcome, informing the widget to continue navigating away from the Country page.
4. If it was not valid, set the `cancel` outcome, keeping the user on the page to fix the validation error.
![customPopup_Save](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/customPopup_Save.png)
### Leave and Discard
1. Roll back the Country object to discard its changes.
2. Close the custom confirmation popup. 
3. Set the `proceed` outcome, informing the widget to continue navigating away from the Country page.
![customPopup_Discard](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/customPopup_Discard.png)
### Cancel
1. Close the custom confirmation popup. 
2. Set the `cancel` outcome, informing the widget to cancel navigating away from the Country page.
![customPopup_Cancel](https://github.com/bsgriggs/mendix-unsaved-changes-message/blob/media/customPopup_Cancel.png)

## Demo project
https://widgettesting105-sandbox.mxapps.io/p/unsaved-changes-message/employees

## Issues, suggestions and feature requests
https://github.com/bsgriggs/mendix-unsaved-changes-message

## Development and contribution
Benjamin Griggs @2023
