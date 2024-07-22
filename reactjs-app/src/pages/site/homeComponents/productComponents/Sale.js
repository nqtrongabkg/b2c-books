import React, { useEffect, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { Link, useNavigate } from 'react-router-dom';
import { star, starOutline, bagAddOutline, repeatOutline, eyeOutline, heartOutline } from 'ionicons/icons';
import ProductSaleService from '../../../../services/ProductSaleService';
import { urlImageProduct } from '../../../../config';
import ProductService from '../../../../services/ProductService';
import FavoriteService from '../../../../services/FavoriteService';
import { toast } from 'react-toastify';
import '../../../../assets/styles/newProduct.css';

const Sale = () => {
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [displayedSales, setDisplayedSales] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(12);

    useEffect(() => {
        (async () => {
            try {
                const result = await ProductSaleService.getAll();
                const filteredSales = result.filter(sale => sale.status !== 2);
                filteredSales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setSales(filteredSales);
                setDisplayedSales(filteredSales.slice(0, itemsToShow));
            }catch (error) {
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
            <h2 className="title text-center" style={{ fontSize: '30px', marginTop: '10px' }}>Sản phẩm giảm giá</h2>
            <div className="product-grid">
                {displayedSales && displayedSales.length > 0 &&
                    displayedSales.map((sale) => (
                        <ProductSaleTableRow key={sale.id} sale={sale} />
                    ))
                }
            </div>
            {displayedSales.length < sales.length && (
                <div className="text-center">
                    <button onClick={handleLoadMore} className="btn-load-more">
                        Xem Thêm
                    </button>
                </div>
            )}
        </div>
    );
};

const ProductSaleTableRow = ({ sale }) => {
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedProduct = await ProductService.getById(sale.productId);
                setProduct(fetchedProduct);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [sale.productId]);

    if (!product) {
        return <div>Loading...</div>; // Or any loading indicator you prefer
    }

    const productImage = product.image ? `${urlImageProduct}/${product.image}` : 'placeholder-image.jpg';
    const discountPercentage = ((product.price - sale.priceSale) / product.price) * 100;

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
                <p className="showcase-badge angle black">sale : {discountPercentage.toFixed(0)}%</p>
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
                <a href="#nqt">
                    <h3 className="showcase-title">{product.description}</h3>
                </a>
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
                    <p className="price">{formatPrice(sale.priceSale)}</p>
                    <del>{formatPrice(product.price)}</del>
                </div>
            </div>
        </div>
    );
};

export default Sale;
