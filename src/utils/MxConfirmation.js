/**
 * @param {{ bodyText: string, proceedCaption: string, onProceed:()=>void, cancelCaption:string }} params
 * @returns {void}
 * This must be in a separate file, because you cannot use mx core apis in typescript
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const MxConfirmation = (bodyText, proceedCaption, cancelCaption, onProceed) => {
    // eslint-disable-next-line no-undef
    mx.ui.confirmation({
        content: bodyText,
        proceed: proceedCaption,
        cancel: cancelCaption,
        handler: onProceed
    });
};

export default MxConfirmation;
