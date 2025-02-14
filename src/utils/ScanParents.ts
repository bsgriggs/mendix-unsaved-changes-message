// scan parents for a specific parent
export function ScanParents(element: Element, selectors: string): boolean {
    if (element.matches(selectors)) {
        return true;
    } else if (element.parentElement === null || element.matches(".mx-page")) {
        return false;
    } else {
        return ScanParents(element.parentElement, selectors);
    }
}
