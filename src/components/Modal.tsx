interface ModalProps {
    children: React.ReactNode;
    title: string;
    size?: "sm" | "md" | "lg" | "xl";
    onDismiss: () => void;
}

const Modal = ({ children, title, size = "md", onDismiss }: ModalProps) => {
    return (
        <div className="modal show d-block" tabIndex={-1}>
            <div className={"modal-dialog modal-" + size}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onDismiss}
                        ></button>
                    </div>
                    <div className="modal-body">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
