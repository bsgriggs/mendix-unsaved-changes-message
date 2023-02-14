## Mendix Unsaved Changes Message
Mendix widget to block the user from closing the browser, closing the tab, or clicking a Mendix navigation when they have unsaved changes.

*Note: the browser based message when the user tries to close the tab or close the browser CANNOT be customized. This was deprecated by most modern browsers.*

## Features
- Based on a boolean expression, dynamically enable the browsers onBeforeUnload event. 
- Based on a boolean expression, block any Mendix navigation with a confirmation message.

## Limitations
- Does not detect browser back or forward buttons 
  - Willing to add this functionality if anyone can find a way in Mendix
- The developer must manually track if the form has changes use onChange actions
  - Willing to automate this process if there is a good, future-proof method

## Usage
1. Create a non-persistent helper object with a hasChanges boolean  
2. Add a data view that returns the helper to your form that wraps your input data view  
3. Add the Unsaved Changes Message widget inside the new data view and set the Block Exit? expression as '$currentObject/hasChanges'  
4. On each input widget, add an on-change action that sets hasChanges to true  

### Observe Mode - Browser
*Only prevents Browser close and tab close*  
5. All set! Run the project, make some changes and attempt to close the browser tab  
   - Debug mode will show you in the UI when the widget's Block Exit flag is enabled/disabled. It will also log useful information to the browser console.  
6. TURN OFF DEBUG MODE!

### Observe Mode - Mendix & Both
5. Set/Copy the Watching Class Name to all containers & buttons that you want to block (i.e. cancel button, layout's navigation list, etc)  
6. Set the On Process action as either a Microflow or a Nanoflow that performs a rollback on your form object. If you're using a non-persistent form object, then you might need to delete the objects. 
7. All set! Run the project, make some changes. 
  - With debug mode on, you will see any content found using your configured Watching Class Name has a red box on top of it. It will also log useful information to the browser console.  
8. TURN OFF DEBUG MODE!  


## Demo project
[link to sandbox]

## Issues, suggestions and feature requests
[[link to GitHub issues]](https://github.com/bsgriggs/mendix-onBeforeUnload)

## Development and contribution
Benjamin Griggs @2023
