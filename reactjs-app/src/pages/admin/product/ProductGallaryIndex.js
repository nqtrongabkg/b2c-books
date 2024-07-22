import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGallaryService from '../../../services/ProductGallaryService';
import UserService from '../../../services/UserService';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaSave, FaTrash } from 'react-icons/fa';
import { urlImageProductGallary } from '../../../config';

const ProductGallaryIndex = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gallaries, setGallaries] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await ProductGallaryService.getByProductId(id);
                if (result !== null) {
                    console.log("gallaries get: ", result);
                }
                setGallaries(result);
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/site-admin/404');
                    console.error("Error fetching data:", error);
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const gallaryRequest = {
            productId: id,
        };

        const path = {
            path: "product-gallaries"
        };

        try {
            for (let image of images) {
                const result = await ProductGallaryService.create(gallaryRequest);
                console.log("gallary added: ", result);
                if (result) {
                    const imageString = await UserService.saveImage(result.id, path, image);
                    if (imageString !== null) {
                        const data = {
                            id: result.id,
                            image: imageString
                        };
                        console.log("string image:", data);
                        await ProductGallaryService.setImage(data);
                    }
                }
            }
            toast.success("Thêm thành công");
            // Refresh the list after adding new images
            const updatedGallaries = await ProductGallaryService.getByProductId(id);
            setGallaries(updatedGallaries);
            // Reset images to empty after successful submission
            setImages([]);
        } catch (error) {
            toast.error("Thêm loại thất bại!");
        }
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleRemoveImage = async (gallaryId) => {
        try {
            const result = await ProductGallaryService.delete(gallaryId);
            if (result.image) {
                const deleteImage = {
                    path: "product-gallaries",
                    filename: result.image
                };
                await UserService.deleteImage(deleteImage)
            }
            toast.success("Xóa hình ảnh thành công");
            // Refresh the list after deleting an image
            const updatedGallaries = await ProductGallaryService.getByProductId(id);
            setGallaries(updatedGallaries);
        } catch (error) {
            toast.error("Xóa hình ảnh thất bại");
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="content">
                <section className="content-header my-2">
                    <h1 className="d-inline">Quản lý danh sách ảnh sản phẩm</h1>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-12 text-end">
                            <Button variant="success" size="sm" href="/admin/product/index" className="ml-2">
                                <FaSave /> Về danh sách sản phẩm
                            </Button>
                        </div>
                    </div>
                </section>
                <section className="content-body my-2">
                    <div className="container">
                        <div className="row">
                            {gallaries.map(gallary => (
                                <div className="col-md-2 mb-4 text-center" key={gallary.id}>
                                    <div className="gallery-image-container mb-2 p-3 border" style={{ maxWidth: '100%', margin: 'auto' }}>
                                        <img src={urlImageProductGallary + gallary.image} alt="Product" className="img-fluid" style={{ maxHeight: '150px' }} />
                                    </div>
                                    <Button variant="danger" size="sm" onClick={() => handleRemoveImage(gallary.id)}>
                                        <FaTrash />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <input type="file" onChange={handleImageChange} accept="image/*" className="form-control mb-2" multiple />
                                <Button type="submit" variant="success" size="sm" disabled={images.length === 0}>
                                    <FaSave /> Lưu [Thêm]
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}

export default ProductGallaryIndex;
