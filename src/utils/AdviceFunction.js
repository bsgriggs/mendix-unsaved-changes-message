/**
 * @param {{ originalFunction: ()=>void, blocked: boolean, message: string,    discardCaption: string, discardAction:ActionValue, cancelCaption:string }} params
 * @returns {()=>void}
 */
const AdviceFunction = (
    originalFunction,
    blocked,
    message,
    discardCaption,
    discardAction,
    cancelCaption
) =>
    function (...args) {
        console.info("advice", { this: this, originalFunction, blocked });
        if (blocked) {
            mx.ui.confirmation({
                content: message,
                proceed: discardCaption,
                cancel: cancelCaption,
                handler: function () {
                    discardChanges(discardAction);
                    originalFunction.apply(this, args);
                }
            });
        } else {
            originalFunction.apply(this, args);
        }
    };
export default AdviceFunction;
