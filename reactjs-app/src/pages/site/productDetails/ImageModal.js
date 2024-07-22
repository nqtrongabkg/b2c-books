import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ImageModal = ({ show, handleClose, imageUrl }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Hình ảnh đánh giá</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <img src={imageUrl} alt="Hình ảnh đánh giá" className="img-fluid" />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImageModal;
