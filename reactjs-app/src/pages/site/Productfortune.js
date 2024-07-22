import React, { useState, useEffect } from 'react';
import '../../assets/styles/productfortune.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import ProductService from '../../services/ProductService';
import { urlImageProduct } from '../../config';

const ProductFortune = () => {
    const [products, setProducts] = useState([]);
    
    const [filters, setFilters] = useState({
        brands: [],
        priceRange: { min: 0, max: 10000 },
        sizes: [],
        ratings: []
    });
    const [reload, setReload] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let result = await ProductService.getAll();
                result = result.filter(product => product.status !== 2);
                const sortedProducts = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setProducts(sortedProducts);
            } catch (error) {
                console.error("Error fetching:", error);
            }
        };
        fetchProducts();
    }, [reload]);

    const handleBrandFilterChange = (brand) => {
        const updatedBrands = filters.brands.includes(brand)
            ? filters.brands.filter(item => item !== brand)
            : [...filters.brands, brand];
        setFilters(prevFilters => ({ ...prevFilters, brands: updatedBrands }));
    };

    const handlePriceRangeFilterChange = (value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            priceRange: { ...prevFilters.priceRange, max: value }
        }));
    };

    const handleSizeFilterChange = (size) => {
        const updatedSizes = filters.sizes.includes(size)
            ? filters.sizes.filter(item => item !== size)
            : [...filters.sizes, size];
        setFilters(prevFilters => ({ ...prevFilters, sizes: updatedSizes }));
    };

    const handleRatingFilterChange = (rating) => {
        const updatedRatings = filters.ratings.includes(rating)
            ? filters.ratings.filter(item => item !== rating)
            : [...filters.ratings, rating];
        setFilters(prevFilters => ({ ...prevFilters, ratings: updatedRatings }));
    };

    const filteredProducts = products.filter(product => {
        if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
            return false;
        }
        const price = parseFloat(product.price);
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
            return false;
        }
        if (filters.sizes.length > 0 && !filters.sizes.includes(product.size)) {
            return false;
        }
        if (filters.ratings.length > 0 && product.rating < Math.min(...filters.ratings)) {
            return false;
        }
        return true;

        
    });

    // Calculate current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Total pages
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredProducts.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
<div className="container">
            <div className="row">
                <div className="col-lg-3">
                    <div className="card">
                        <div className="card-header bg-primary text-white">Filters</div>
                        <div className="card-body">
                            {/* Brands Filter */}
                            <h6 className="fw-bold">Brands</h6>
                            {['Mercedes', 'Toyota', 'Mitsubishi', 'Nissan', 'Honda', 'Suzuki'].map((brand, index) => (
                                <div className="form-check">
                                    <input
                                    key={index}
                                        className="form-check-input"
                                        type="checkbox"
                                        value={brand}
                                        id={`brand-${brand}`}
                                        checked={filters.brands.includes(brand)}
                                        onChange={() => handleBrandFilterChange(brand)}
                                    />
                                    <label className="form-check-label" htmlFor={`brand-${brand}`}>
                                        {brand}
                                    </label>
                                </div>
                            ))}
                            {/* Price Range Filter */}
                            <h6 className="fw-bold mt-3">Price Range</h6>
                            <input
                                type="range"
                                className="form-range"
                                min="0"
                                max="10000"
                                value={filters.priceRange.max}
                                onChange={(e) => handlePriceRangeFilterChange(e.target.value)}
                            />
                            <div>Max Price: ${filters.priceRange.max}</div>
                            {/* Sizes Filter */}
                            <h6 className="fw-bold mt-3">Sizes</h6>
                            {['XS', 'SM', 'LG', 'XXL'].map((size, index) => (
                                <div className="form-check">
                                    <input
                                    key={index}
                                        className="form-check-input"
                                        type="checkbox"
                                        value={size}
                                        id={`size-${size}`}
                                        checked={filters.sizes.includes(size)}
                                        onChange={() => handleSizeFilterChange(size)}
                                    />
                                    <label className="form-check-label" htmlFor={`size-${size}`}>
                                        {size}
                                    </label>
                                </div>
                            ))}
                            {/* Ratings Filter */}
                            <h6 className="fw-bold mt-3">Ratings</h6>
                            {[1, 2, 3, 4, 5].map((rating, index) => (
                                <div className="form-check">
                                    <input
                                    key={index}
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
                    {/* Product Grid */}
                    <div className="row">
                    {currentItems && currentItems.length > 0 &&
                            currentItems.map((product, index) => {
                                return (
                                <div key={index} className="col-lg-4 col-md-6 mb-4 d-flex">
                                <div className="card w-100 my-2 shadow-2-strong">
                                <img src={urlImageProduct + product.image} className="card-img-top" alt="Hinh anh" />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">${product.price.toFixed(2)}</h5>
                                        <p className="card-text">{product.description || 'No description available.'}</p>
                                        <div className="d-flex align-items-center">
                                            {Array.from({ length: product.evaluate }, (_, i) => (
                                                <FontAwesomeIcon key={i} icon={faStar} />
                                            ))}
                                        </div>
                                        <div className="card-footer d-flex align-items-end pt-3 px-0 pb-0 mt-auto">
                                            <a href="#!" className="btn btn-primary shadow-0 me-1">Add to cart</a>
                                            <a href="#!" className="btn btn-light border icon-hover px-2 pt-2">
                                                <FontAwesomeIcon icon={faHeart} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             );
                            })
                        }
                    </div>
                    {/* Pagination */}
                    <nav>
                        <ul className='pagination'>
                        {pageNumbers.map((number) => (
                                <li key={number} className='page-item'>
                                    <a onClick={() => paginate(number)} href='#!' className='page-link'>
                                        {number}
                                    </a>
                                </li>
                            ))}

                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default ProductFortune;
