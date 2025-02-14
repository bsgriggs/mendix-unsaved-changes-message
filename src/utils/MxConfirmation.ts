const MxConfirmation = (
    bodyText: string,
    proceedCaption: string,
    cancelCaption: string,
    onProceed: () => void,
    onCancel?: () => void
): Promise<boolean> => {
    return new Promise(
        resolve =>
            /* eslint-disable */
            // @ts-ignore
            mx.ui.confirmation({
                content: bodyText,
                proceed: proceedCaption,
                cancel: cancelCaption,
                handler: () => {
                    onProceed();
                    resolve(true);
                },
                onCancel: () => {
                    if (onCancel !== undefined) {
                        onCancel();
                    }
                    resolve(false);
                }
            })
        /* eslint-enable */
    );
};

export default MxConfirmation;
