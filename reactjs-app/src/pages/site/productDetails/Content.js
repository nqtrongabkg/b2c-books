import React, { useEffect, useState } from 'react';
import FeedbackService from '../../../services/FeedbackService';
import ProductService from '../../../services/ProductService';
import { useParams, useNavigate } from 'react-router-dom';
import { urlImageFeedback, urlImageProduct } from '../../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ImageModal from './ImageModal';
import '../../../assets/styles/content.css';
import UserService from '../../../services/UserService';
import Pagination from '../homeComponents/productComponents/Pagination';

const Content = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [feedbacksPerPage] = useState(5);
    const [showModal, setShowModal] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [products, setProducts] = useState([]);
    const [shop, setShop] = useState(null);

    useEffect(() => {
        const getData = async (id) => {
            const result = await FeedbackService.getByProductId(id);
            if (result) {
                const feedbacksWithUser = await Promise.all(result.map(async (feedback) => {
                    const user = await UserService.getUserById(feedback.createdBy);
                    return { ...feedback, userName: user ? user.name : 'Unknown' };
                }));
                setFeedbacks(feedbacksWithUser);
            }

            const getProduct = await ProductService.getById(id);
            if (getProduct) {
                const getProducts = await ProductService.getByUser(getProduct.createdBy, 0, 5);
                const getShop = await UserService.getUserById(getProduct.createdBy);
                if (getProducts && getProducts.content) {
                    setProducts(getProducts.content);
                }
                if (getShop) {
                    setShop(getShop);
                }
            }
        };
        getData(id);
    }, [id]);

    const handleImageClick = (imageUrl) => {
        setCurrentImage(imageUrl);
        setShowModal(true);
    };

    const handleProductClick = (productId) => {
        navigate(`/product-detail/${productId}`);
    };

    const handleShopClick = (shopId) => {
        navigate(`/product-of-shop/${shopId}`);
    };

    const renderStars = (count) => {
        return [...Array(5)].map((_, i) => (
            <FontAwesomeIcon
                key={i}
                icon={faStar}
                className={i < count ? 'text-warning' : 'text-muted'}
            />
        ));
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN');
    };

    // Pagination Controls
    const indexOfLastFeedback = currentPage * feedbacksPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
    const currentFeedbacks = feedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <section className="bg-light border-top py-4">
            <div className="container">
                <div className="row gx-4">
                    <div className="col-lg-12 mb-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Đánh giá sản phẩm</h5>
                                {currentFeedbacks.length > 0 ? (
                                    currentFeedbacks.map(feedback => (
                                        <div key={feedback.id} className="d-flex mb-4 feedback-item">
                                            <div className="me-3" onClick={() => handleImageClick(`${urlImageFeedback}${feedback.image}`)}>
                                                <img src={`${urlImageFeedback}${feedback.image}`} style={{ width: 96, height: 96, cursor: 'pointer' }} className="img-md img-thumbnail" alt="Hình ảnh đánh giá" />
                                            </div>
                                            <div className="info">
                                                <div className="nav-link mb-1">
                                                <div className="text-muted">Người đánh giá: {feedback.userName ? feedback.userName : "Unknown"}</div>
                                                    <div>Đánh giá: {renderStars(feedback.evaluate)}</div>
                                                    <div>{feedback.description}</div>
                                                    <strong className="text-dark">{feedback.detail}</strong>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Chưa có đánh giá</p>
                                )}
                                {/* Pagination */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(feedbacks.length / feedbacksPerPage)}
                                    onPageChange={paginate}
                                />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <ImageModal show={showModal} handleClose={() => setShowModal(false)} imageUrl={currentImage} />
        </section>
    );
};

export default Content;
