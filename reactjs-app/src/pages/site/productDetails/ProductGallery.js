import React, { useState, useEffect } from 'react';
import '../../../assets/styles/productGallary.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faShoppingBasket, faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import ProductGallaryService from '../../../services/ProductGallaryService';
import OrderService from '../../../services/OrderService';
import OrderItemService from '../../../services/OrderItemService';
import { urlImageProductGallary } from '../../../config';
import ProductOptionService from '../../../services/ProductOptionService';
import ProductService from '../../../services/ProductService';
import ProductSaleService from '../../../services/ProductSaleService';
import ProductStoreService from '../../../services/ProductStoreService';
import { toast } from 'react-toastify';

const ProductGallery = () => {
    const { id } = useParams();
    const [galleries, setGalleries] = useState([]);
    const [options, setOptions] = useState([]);
    const [mainImage, setMainImage] = useState('');
    const [activeOptionId, setActiveOptionId] = useState(null);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [priceToDisplay, setPriceToDisplay] = useState(0);
    const navigate = useNavigate();
    const [optionValueId, setOptionValueId] = useState(null);
    const [stockAvailability, setStockAvailability] = useState({});

    const fetchStockAvailability = async () => {
        const availability = {};
        const promises = options.map(async (option) => {
            return Promise.all(option.values.map(async (value) => {
                const available = await checkQuantityInStore(value.id);
                availability[value.id] = available;
            }));
        });

        await Promise.all(promises);
        setStockAvailability(availability);
    };

    useEffect(() => {
        if (options.length > 0) {
            fetchStockAvailability();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const productData = await ProductService.getById(id);
                if (productData !== null) {
                    setProduct(productData);
                }
                const galleryResults = await ProductGallaryService.getByProductId(id);
                if (galleryResults && galleryResults.length > 0) {
                    setGalleries(galleryResults);
                    setMainImage(galleryResults[0].image);
                }
                const optionsResults = await ProductOptionService.getByProduct(id);
                if (optionsResults !== null) {
                    setOptions(optionsResults);
                }

                const sales = await ProductSaleService.getByProduct(id);
                if (sales === null && productData) {
                    setPriceToDisplay(productData.price);
                } else {
                    const now = new Date();
                    const currentSale = sales.find(sale => new Date(sale.dateBegin) <= now && now <= new Date(sale.dateEnd));
                    if (currentSale) {
                        setPriceToDisplay(currentSale.priceSale);
                    } else {
                        setPriceToDisplay(productData.price);
                    }
                }
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [id, navigate]);

    if (product === null) {
        return <div>Loading...</div>;
    }

    const handleThumbnailClick = (image) => {
        setMainImage(image);
    };

    const toggleOptionVisibility = (optionId) => {
        setActiveOptionId(prevState => prevState === optionId ? null : optionId);
    };

    const handleValueClick = (id) => {
        console.log("Selected value id:", id);
        setOptionValueId(id);
    }

    const handleQuantityDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleQuantityIncrease = () => {
        setQuantity(quantity + 1);
    };

    const checkQuantityInStore = async (optionValueId) => {
        try {
            const result = await ProductStoreService.getByOptionValue(optionValueId);
            return result && result.quantity > 0;
        } catch (error) {
            console.error("Error checking stock:", error);
            return false;
        }
    };

    const handleAddToCartClick = async () => {
        try {
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (!user) {
                navigate("/login", { state: { redirectTo: `/product-detail/${id}` } });
                return;
            }
    
            if (!stockAvailability[optionValueId]) { // Check if the selected option value is out of stock
                toast.error("Sản phẩm bạn chọn hiện tại hết hàng.");
                return;
            }
    
            // Kiểm tra số lượng trong kho so với số lượng mua
            const qtyStore = await ProductStoreService.getByOptionValue(optionValueId);
            if (qtyStore.quantity < quantity) {
                toast.error(`Số lượng sản phẩm chỉ còn ${qtyStore.quantity}`);
                return;
            }
    
            const cart = await OrderService.getCart(user.userId);
            const totalPrice = quantity * priceToDisplay;
            if (cart) {
                const dataCreate = {
                    orderId: cart.id,
                    productId: id,
                    optionValueId: optionValueId,
                    quantity,
                    totalPrice,
                    status: 1,
                };
    
                const addedOrderItem = await OrderItemService.create(dataCreate);
                if (addedOrderItem) {
                    const dataUpdateCart = {
                        userId: cart.userId,
                        totalPrice: cart.totalPrice + totalPrice,
                        deliveryAddress: cart.deliveryAddress,
                        deliveryPhone: cart.deliveryPhone,
                        deliveryName: cart.deliveryName,
                        status: cart.status,
                    };
                    await OrderService.update(cart.id, dataUpdateCart);
                    toast.success("Thêm vào giỏ hàng thành công");
                } else {
                    toast.error("Không thể thêm vào giỏ hàng");
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 503) {
                navigate('/404');
            } else {
                console.error("Error fetching data:", error);
            }
        }
    };
    

    const ThumbnailsCarousel = ({ galleries, handleThumbnailClick }) => {
        const [visibleStart, setVisibleStart] = useState(0);
        const maxVisible = 4; // Number of thumbnails visible at any time

        const handlePrevClick = () => {
            setVisibleStart(Math.max(0, visibleStart - maxVisible));
        };

        const handleNextClick = () => {
            setVisibleStart(Math.min(galleries.length - maxVisible, visibleStart + maxVisible));
        };

        return (
            <div className="thumbnail-carousel d-flex align-items-center justify-content-center">
                <button className="btn btn-outline-secondary me-2" onClick={handlePrevClick} disabled={visibleStart === 0}>
                    &lt;
                </button>
                <div className="thumbnails d-flex overflow-auto" style={{ width: 'calc(100% - 100px)' }}>
                    {galleries.slice(visibleStart, visibleStart + maxVisible).map((gallery, index) => (
                        <a key={index}
                            className="border mx-1"
                            target="_blank"
                            data-type="image"
                            href={gallery.image}
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.preventDefault();
                                handleThumbnailClick(gallery.image);
                            }}>
                            <img width="120"
                                height="120"
                                className="img-fluid rounded"
                                src={urlImageProductGallary + gallery.image}
                                alt={`Thumbnail ${index + 1}`} />
                        </a>
                    ))}
                </div>
                <button className="btn btn-outline-secondary ms-2" onClick={handleNextClick} disabled={visibleStart + maxVisible >= galleries.length}>
                    &gt;
                </button>
            </div>

        );
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN');
    };

    return (
        <section className="py-5">
            <div className="container">
                <div className="row gx-5">
                    <aside className="col-lg-6">
                        <div className="border rounded-4 mb-3 d-flex justify-content-center">
                            <a href='#nqt' data-fslightbox="mygallery" className="rounded-4" target="_blank" data-type="image">
                                <img style={{ maxWidth: '100%', maxHeight: '100vh', margin: 'auto' }} src={urlImageProductGallary + mainImage} alt="Main Product" />
                            </a>
                        </div>
                        <ThumbnailsCarousel galleries={galleries} handleThumbnailClick={handleThumbnailClick} />
                    </aside>
                    <main className="col-lg-6">
                        <div className="ps-lg-3">
                            <h4 className="title text-dark">{product.name}</h4>
                            <div className="d-flex flex-row my-3">
                                <div className="text-warning mb-1 me-2">
                                    {Array.from({ length: product.evaluate }, (_, i) => (
                                        <FontAwesomeIcon key={i} icon={faStar} />
                                    ))}
                                    {Array.from({ length: 5 - product.evaluate }, (_, i) => (
                                        <FontAwesomeIcon key={product.evaluate + i} icon={faStar} style={{ color: '#e4e5e9' }} />
                                    ))}
                                </div>
                            </div>
                            <div className="mb-3">
                                <span className="h5">Giá bán: {formatPrice(priceToDisplay)}</span>
                            </div>
                            <p>{product.description}</p>
                            <p>{product.detail}</p>
                            <main className="col-lg-6">
                                <div className="product-options" style={{ margin: '10px 0', padding: '10px' }}>
                                    <h2>Chọn sản phẩm</h2>
                                    {options.length > 0 ? options.map((option) => (
                                        <div key={option.id} className="option-container d-flex flex-column gap-1" style={{ padding: '5px' }}>
                                            <button className={`btn w-100 text-start ${activeOptionId === option.id ? 'btn-info' : 'btn-light'}`} style={{ marginBottom: '5px' }} onClick={() => toggleOptionVisibility(option.id)}>
                                                {option.name}:
                                            </button>
                                            {activeOptionId === option.id && (
                                                <ul className="option-values d-flex flex-wrap list-unstyled gap-1 mb-0" style={{ padding: '1px', margin: '0' }}>
                                                    {option.values.map(value => (
                                                        <li key={value.id} className="option-item ms-3" style={{ padding: '2px' }}>
                                                            <button
                                                                className={`btn ${optionValueId === value.id ? 'btn-info' : 'btn-light'}`}
                                                                onClick={() => stockAvailability[value.id] ? handleValueClick(value.id) : null}
                                                                disabled={!stockAvailability[value.id]}
                                                            >
                                                                {value.value === "N/A" ? "Mặc định" : value.value}
                                                                {!stockAvailability[value.id] && " (Hết hàng)"}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )) : <p>Sản phẩm chỉ có 1 mẫu, không có sự lựa chọn.</p>}
                                </div>
                            </main>
                            <hr />
                            <div className="col-md-4 col-6 mb-3">
                                <label className="mb-2 d-block">Số lượng</label>
                                <div className="input-group quantity-input">
                                    <button className="btn btn-decrease" type="button" onClick={handleQuantityDecrease}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                    <input type="text" className="form-control text-center quantity-display" value={quantity} readOnly />
                                    <button className="btn btn-increase" type="button" onClick={handleQuantityIncrease}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            </div>

                            <div className="row">
                                <button
                                    className="btn btn-primary shadow-0"
                                    onClick={handleAddToCartClick}
                                    disabled={!stockAvailability[optionValueId]} // Disable based on stock availability
                                >
                                    <FontAwesomeIcon icon={faShoppingBasket} /> Thêm vào giỏ
                                </button>

                                <button className="btn btn-danger border border-secondary py-2 px-3">
                                    <FontAwesomeIcon icon={faHeart} /> Thêm vào yêu thích
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </section>
    );
};

export default ProductGallery;
