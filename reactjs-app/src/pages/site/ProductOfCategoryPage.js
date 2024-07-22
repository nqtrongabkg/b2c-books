import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import ProductService from '../../services/ProductService';
import ProductCategoryService from '../../services/ProductCategory';
import FavoriteService from '../../services/FavoriteService';
import { urlImageProduct } from '../../config';
import CategoryService from '../../services/CategoryService';
import { toast } from 'react-toastify';
import { IonIcon } from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';

const ProductOfCategoryPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [filters, setFilters] = useState({
        priceRange: { min: 0, max: 10000 },
        ratings: []
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productCategoryResponse = await ProductCategoryService.getByCategoryId(id);
                if (Array.isArray(productCategoryResponse)) {
                    const productDetailsPromises = productCategoryResponse.map(productCategory =>
                        ProductService.getById(productCategory.productId)
                            .then(response => response)
                            .catch(err => null)
                    );
                    const productDetailsResponses = await Promise.all(productDetailsPromises);
                    const productsData = productDetailsResponses.filter(product => product !== null);
                    setProducts(productsData);
                    // Calculate the maximum price among the products and set it as the default max price
                    const maxPrice = Math.max(...productsData.map(product => parseFloat(product.price)));
                    setFilters(prevFilters => ({
                        ...prevFilters,
                        priceRange: { ...prevFilters.priceRange, max: maxPrice }
                    }));
                }
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        const fetchCategories = async () => {
            try {
                let result = await CategoryService.getAll();
                const sortedbrands = result.filter(brand => brand.status !== 0 && brand.status !== 2);
                setCategories(sortedbrands);
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchCategories();
        fetchProducts();
        window.scrollTo(0, 0); // Scroll to top when id changes
    }, [id, navigate]);

    const handlePriceRangeFilterChange = (value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            priceRange: { ...prevFilters.priceRange, max: value }
        }));
    };

    const handleRatingFilterChange = (rating) => {
        const ratingValue = parseInt(rating, 10);
        const updatedRatings = filters.ratings.includes(ratingValue)
            ? filters.ratings.filter(r => r !== ratingValue)
            : [...filters.ratings, ratingValue];

        setFilters(prevFilters => ({ ...prevFilters, ratings: updatedRatings }));
    };

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const price = parseFloat(product.price);
            if (price < filters.priceRange.min || price > filters.priceRange.max) {
                return false;
            }
            if (filters.ratings.length > 0 && !filters.ratings.includes(product.evaluate)) {
                return false;
            }
            return true;
        });
    }, [products, filters]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // Scroll to top when page changes
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredProducts.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const addProductToFavorite = async (productId) => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            navigate("/login", { state: { redirectTo: `/product-of-category/${id}` } });
            return;
        }
        else {
            const favoriteAdd = {
                productId: productId,
                userId: JSON.parse(sessionStorage.getItem('user'))?.userId
            };
            const favoriteaAdded = await FavoriteService.create(favoriteAdd);
            if (favoriteaAdded !== null) {
                toast.success("Đã thêm sản phẩm vào yêu thích");
            }
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-3">
                    <div className="card">
                    <div className="card-header bg-info text-white text-wrap badge">Bộ lọc</div>
                        <div className="card-body">
                            <h6 className="fw-bold mt-3">Danh mục sản phẩm</h6>
                            <div className="list-unstyled">
                                {categories.map((category, index) => (
                                    <Link key={index} to={`/product-of-category/${category.id}`} className="d-block mb-2">
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                            <h6 className="fw-bold mt-3">Lọc theo giá</h6>
                            <input
                                type="number"
                                className="form-control"
                                min="1000"
                                max="100000000"
                                value={filters.priceRange.max}
                                onChange={(e) => handlePriceRangeFilterChange(e.target.value)}
                            />
                            <input
                                type="range"
                                className="form-range"
                                min="1000"
                                max="100000000"
                                value={filters.priceRange.max}
                                onChange={(e) => handlePriceRangeFilterChange(e.target.value)}
                            />
                            <div>Giá cao nhất: {formatPrice(filters.priceRange.max)} VND</div>

                            <h6 className="fw-bold mt-3">Lọc theo sao</h6>
                            {[1, 2, 3, 4, 5].map((rating, index) => (
                                <div key={index} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={rating}
                                        id={`rating-${rating}`}
                                        checked={filters.ratings.includes(rating)}
                                        onChange={() => handleRatingFilterChange(rating)}
                                    />
                                    <label className="form-check-label" htmlFor={`rating-${rating}`}>
                                        {Array(rating).fill(<FontAwesomeIcon icon={faStar} />)}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-lg-9">
                    <div className="row">
                        {currentItems.map((product, index) => (
                            <div key={index} className="col-lg-3 col-md-6 mb-4 d-flex">
                                <div className="card w-100 my-2 shadow-2-strong">
                                    <img src={urlImageProduct + product.image} className="card-img-top" alt="Hinh anh" />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{formatPrice(product.price)} VND</h5>
                                        <p className="card-text">{product.description || 'No description available.'}</p>
                                        <div className="d-flex align-items-center">
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
                                        <div className="card-footer d-flex align-items-end pt-3 px-0 pb-0 mt-auto">
                                            <a href={`/product-detail/${product.id}`} className="btn btn-primary shadow-0 me-1">Xem sản phẩm</a>
                                            <div onClick={() => addProductToFavorite(product.id)} className="btn btn-light border icon-hover px-2 pt-2">
                                                <FontAwesomeIcon icon={faHeart} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <nav>
                    <ul className='pagination'>
                        {pageNumbers.map((number, index) => (
                            <li key={index} className='page-item'>
                                <a onClick={() => paginate(number)} href='#!' className='page-link'>
                                    {number}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default ProductOfCategoryPage;
