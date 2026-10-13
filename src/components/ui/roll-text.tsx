/**
 * Button label that rolls up on hover: the text slides out the top while a copy
 * slides in from below. Hover is detected on the nearest `.group` ancestor.
 */
export function RollText({ children }: { children: string }) {
    return (
        <span className="roll-text" data-text={children}>
            <span>{children}</span>
        </span>
    );
}
