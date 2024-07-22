import React, { useEffect, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { Link, useNavigate } from 'react-router-dom';
import { star, starOutline, bagAddOutline, repeatOutline, eyeOutline, heartOutline } from 'ionicons/icons';
// import { FaChevronDown } from 'react-icons/fa';
import ProductService from '../../../../services/ProductService';
import ProductSaleService from '../../../../services/ProductSaleService';
import FavoriteService from '../../../../services/FavoriteService';
import { toast } from 'react-toastify';
import { urlImageProduct } from '../../../../config';
import '../../../../assets/styles/newProduct.css';

const NewProducts = () => {
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(12);

    useEffect(() => {
        (async () => {
            try {
                const result = await ProductService.getAll();
    
                // Lọc sản phẩm có trạng thái khác 2
                const filteredProducts = result.filter(product => product.status !== 2);
    
                // Sắp xếp sản phẩm theo ngày tạo mới nhất giảm dần
                const sortedProducts = filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
                // Lấy thông tin giảm giá cho từng sản phẩm
                const productsWithSale = await Promise.all(sortedProducts.map(async (product) => {
                    const saleInfoList = await ProductSaleService.getByProduct(product.id);
                    if (saleInfoList && saleInfoList.length > 0) {
                        const latestSaleInfo = saleInfoList.reduce((latestSale, currentSale) => {
                            return new Date(currentSale.createdAt) > new Date(latestSale.createdAt) ? currentSale : latestSale;
                        });
                        product.salePrice = latestSaleInfo.priceSale;
                    }
                    return product;
                }));
    
                setAllProducts(productsWithSale);
                setDisplayedProducts(productsWithSale.slice(0, itemsToShow));
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        })();
    }, [itemsToShow, navigate]);
    
    const handleLoadMore = () => {
        setItemsToShow(prev => prev + 12);
    };

    return (
        <div className="product-main border-top border-4 border-dark">
            <h2 className="title text-center" style={{ fontSize: '30px', marginTop: '10px' }}>Sản phẩm mới nhất</h2>
            <div className="product-grid">
                {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {displayedProducts.length < allProducts.length && (
                <div className="text-center">
                    <button onClick={handleLoadMore} className="btn-load-more">
                        Xem Thêm
                    </button>
                </div>
            )}
        </div>
    );
};

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const productImage = product.image ? `${urlImageProduct}/${product.image}` : 'placeholder-image.jpg';
    const addProductToFavorite = async (productId) => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            navigate("/login", { state: { redirectTo: `/` } });
            return;
        }
        const favoriteAdd = { productId, userId: user.userId };
        const favoriteAdded = await FavoriteService.create(favoriteAdd);
        if (favoriteAdded !== null) {
            toast.success("Đã thêm sản phẩm vào yêu thích");
        }
    };

    const formatPrice = (price) => price.toLocaleString('vi-VN');

    return (
        <div className="showcase">
            <div className="showcase-banner">
                <img src={productImage} className="product-img default" alt={product.name} />
                <img src={productImage} width={300} className="product-img hover" alt={`${product.name} on hover`} />
                {product.salePrice && (
                    <p className="showcase-badge angle black">Sale: {((product.price - product.salePrice) / product.price * 100).toFixed(0)}%</p>
                )}
                <div className="showcase-actions">
                    <button className="btn-action" onClick={() => addProductToFavorite(product.id)}>
                        <IonIcon icon={heartOutline} />
                    </button>
                    <button className="btn-action">
                        <Link to={`/product-detail/${product.id}`}>
                            <IonIcon icon={eyeOutline} />
                        </Link>
                    </button>
                    <button className="btn-action">
                        <IonIcon icon={repeatOutline} />
                    </button>
                    <button className="btn-action">
                        <IonIcon icon={bagAddOutline} />
                    </button>
                </div>
            </div>
            <div className="showcase-content">
                <a href="#nqt" className="showcase-category">{product.name}</a>
                <h3 className="showcase-title">{product.description}</h3>
                <div className="showcase-rating">
                    {Array(product.evaluate)
                        .fill()
                        .map((_, index) => (
                            <IonIcon key={index} icon={star} />
                        ))}
                    {Array(5 - product.evaluate)
                        .fill()
                        .map((_, index) => (
                            <IonIcon key={product.evaluate + index} icon={starOutline} />
                        ))}
                </div>
                <div className="price-box">
                    {product.salePrice ? (
                        <>
                            <p className="price">{formatPrice(product.salePrice)}</p>
                            <del>{formatPrice(product.price)}</del>
                        </>
                    ) : (
                        <p className="price">{formatPrice(product.price)}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewProducts;
