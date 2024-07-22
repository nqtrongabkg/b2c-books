import React, { useState, useEffect } from 'react';
import IonIcon from '@reacticons/ionicons';
import logo from '../../../assets/images/logo/logo.svg';
import Menu from '../../../pages/site/header/menu';
import '../../../assets/styles/searchResult.css';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../../services/CategoryService';
import BrandService from '../../../services/BrandService';
import ProductService from '../../../services/ProductService';
import OrderService from '../../../services/OrderService';
import OrderItemService from '../../../services/OrderItemService';
import FavoriteService from '../../../services/FavoriteService';
import NotificationService from '../../../services/NotificationService';
import { urlImageCategory, urlImageBrand, urlImageProduct } from '../../../config';

export default function Header() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState({ categories: [], brands: [], products: [] });
    const [cartItemCount, setCartItemCount] = useState(0);
    const [favoriteItemCount, setFavoriteItemCount] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [reload, setReload] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                if (searchTerm.trim() !== "") {
                    const [categoryResults, brandResults, productResults] = await Promise.all([
                        CategoryService.search(searchTerm),
                        BrandService.search(searchTerm),
                        ProductService.search(searchTerm)
                    ]);
                    setSearchResults({
                        categories: categoryResults,
                        brands: brandResults,
                        products: productResults
                    });
                } else {
                    setSearchResults({ categories: [], brands: [], products: [] });
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        fetchSearchResults();
    }, [searchTerm, reload]);

    useEffect(() => {
        const fetchCartItemCount = async () => {
            try {
                const user = JSON.parse(sessionStorage.getItem('user'));
                if (!user) return;
                const cart = await OrderService.getCart(user.userId);
                if (!cart) return;
                const cartItems = await OrderItemService.getByOrder(cart.id);
                if (cartItems) {
                    setCartItemCount(cartItems.length);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItemCount();
    }, [reload]);

    useEffect(() => {
        const fetchFavoriteItemCount = async () => {
            try {
                const user = JSON.parse(sessionStorage.getItem('user'));
                if (!user) return;
                const favorites = await FavoriteService.getByUser(user.userId);
                if (favorites) {
                    setFavoriteItemCount(favorites.length);
                }
            } catch (error) {
                console.error('Error fetching favorite items:', error);
            }
        };

        fetchFavoriteItemCount();
    }, [reload]);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            const fetchNotificationCount = async () => {
                try {
                    const count = await NotificationService.countUnseen(user.userId);
                    if (count) {
                        setNotificationCount(count);
                    }
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };
            const fetchNotifications = async () => {
                try {
                    const getNotifications = await NotificationService.getByUser(user.userId);
                    if (getNotifications) {
                        setNotifications(getNotifications);
                    }
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };

            fetchNotifications();
            fetchNotificationCount();
        }
    }, [reload]);

    const handleGoToMyUserClick = () => {
        setReload(Date.now());
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            navigate("/login", { state: { redirectTo: `/my-user` } });
            return;
        }
        navigate("/my-user");
    };

    const handleGoToCartClick = () => {
        setReload(Date.now());
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            navigate("/login", { state: { redirectTo: `/shopping-cart` } });
            return;
        }
        navigate("/shopping-cart");
    };

    const handleGoToFavoriteClick = () => {
        setReload(Date.now());
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            navigate("/login", { state: { redirectTo: `/favorite` } });
            return;
        }
        navigate("/favorite");
    };

    const handleGoToNotificationsClick = () => {
        setReload(Date.now());
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            navigate("/login", { state: { redirectTo: `/` } });
            return;
        }
        setShowNotifications(!showNotifications);
    };

    const handleSearchInputChange = (event) => {
        const { value } = event.target;
        setSearchTerm(value);
    };

    const handleSearchItemClick = (type, id) => {
        if (type === 'category') {
            navigate(`/product-of-category/${id}`);
        } else if (type === 'brand') {
            navigate(`/product-of-brand/${id}`);
        } else if (type === 'product') {
            navigate(`/product-detail/${id}`);
        }
        setSearchTerm("");
    };

    const handleGoToOrderItem = (linkTo) => {
        setReload(Date.now());
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            navigate("/login", { state: { redirectTo: `${linkTo}` } });
            return;
        }
        setShowNotifications(!showNotifications);
        navigate(`${linkTo}`);
    };

    const seen = async (id) => {
        await NotificationService.seen(id);
        setReload(Date.now());
    };

    return (
        <>
            <header>
                <div className="header-main">
                    <div className="container">
                        <a href="/" className="header-logo">
                            <img src={logo} alt="Anon's logo" width="120" height="36" />
                        </a>

                        <div className="header-search-container">
                            <input
                                type="search"
                                name="search"
                                className="search-field"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                            />
                            <button className="search-btn">
                                <IonIcon name="search-outline" role="img" className="md hydrated" aria-label="search outline"></IonIcon>
                            </button>

                            {(searchResults.categories.length > 0 || searchResults.brands.length > 0 || searchResults.products.length > 0) && (
                                <div className="search-results">
                                    {searchResults.categories.length > 0 && (
                                        <div>
                                            <h6>Danh mục</h6>
                                            {searchResults.categories.slice(0, 8).map((category) => (
                                                <div
                                                    key={category.id}
                                                    className="search-result-item"
                                                    onClick={() => handleSearchItemClick('category', category.id)}
                                                >
                                                    <img src={urlImageCategory + category.image} alt='HinhAnh' />
                                                    <div>
                                                        <h5>{category.name}</h5>
                                                        <p>{category.description}</p>
                                                    </div>
                                                    <div className="product-price">
                                                        <span>{category.productQuantity} Sản phẩm</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {searchResults.brands.length > 0 && (
                                        <div>
                                            <h6>Thương hiệu</h6>
                                            {searchResults.brands.slice(0, 8).map((brand) => (
                                                <div
                                                    key={brand.id}
                                                    className="search-result-item"
                                                    onClick={() => handleSearchItemClick('brand', brand.id)}
                                                >
                                                    <img src={urlImageBrand + brand.image} alt='HinhAnh' />
                                                    <div>
                                                        <h5>{brand.name}</h5>
                                                        <p>{brand.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {searchResults.products.length > 0 && (
                                        <div>
                                            <h6>Sản phẩm</h6>
                                            {searchResults.products.slice(0, 8).map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="search-result-item"
                                                    onClick={() => handleSearchItemClick('product', product.id)}
                                                >
                                                    <img src={urlImageProduct + product.image} alt='HinhAnh' />
                                                    <div>
                                                        <h5>{product.name}</h5>
                                                        <p>{product.description}</p>
                                                    </div>
                                                    <div className="product-price">
                                                        <span>{product.price} VND</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="header-user-actions">
                            <button className="action-btn" onClick={handleGoToMyUserClick}>
                                <IonIcon name="person-outline" role="img" className="md hydrated" aria-label="person outline"></IonIcon>
                            </button>

                            <button className="action-btn" onClick={handleGoToFavoriteClick}>
                                <IonIcon name="heart-outline" role="img" className="md hydrated" aria-label="heart outline"></IonIcon>
                                <span className="count">{favoriteItemCount}</span>
                            </button>

                            <button className="action-btn" onClick={handleGoToCartClick}>
                                <IonIcon name="bag-handle-outline" role="img" className="md hydrated" aria-label="bag handle outline"></IonIcon>
                                <span className="count">{cartItemCount}</span>
                            </button>

                            <button className="action-btn" onClick={handleGoToNotificationsClick}>
                                <IonIcon name="notifications-outline" role="img" className="md hydrated" aria-label="notifications outline"></IonIcon>
                                <span className="count">{notificationCount}</span>
                            </button>
                        </div>
                        {user && showNotifications && (
                            <div className="notification-dropdown text-center">
                                {notifications.length > 0 ? notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`notification-item ${notification.statusOfSee === 0 ? 'notification-item-unread' : ''} d-flex align-items-center`}
                                        onClick={() => {
                                            seen(notification.id);
                                            handleGoToOrderItem(notification.linkTo);
                                        }}
                                    >
                                        <div className="icon-small d-flex justify-content-center align-items-center">
                                            <IonIcon name="cart-outline" role="img" aria-label="shopping cart" />
                                        </div>
                                        <p className="mb-0">{notification.detail}</p>
                                    </div>
                                )) : <p>Không có thông báo!</p>}
                            </div>
                        )}
                    </div>
                </div>
                <nav className="desktop-navigation-menu">
                    <div className="container">
                        <Menu />
                    </div>
                </nav>
            </header>
        </>
    );
}
