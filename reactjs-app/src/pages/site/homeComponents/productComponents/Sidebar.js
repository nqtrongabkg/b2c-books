import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../../../services/CategoryService';
import BrandService from '../../../../services/BrandService';
import { urlImageCategory, urlImageBrand } from '../../../../config';

const Sidebar = () => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResult = await CategoryService.getAll();
                const brandsResult = await BrandService.getAll();
                const filteredCategories = categoriesResult.filter(category => category.status === 3);
                const filteredBrands = brandsResult.filter(brand => brand.status === 3);
                setCategories(filteredCategories);
                setBrands(filteredBrands);
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
    }, []);

    const renderCategories = () => {
        return categories.map(category => (
            <li key={category.id} className="dropdown-item">
                <button 
                    className="sidebar-accordion-menu" 
                    data-accordion-btn
                    onClick={() => navigate(`/product-of-category/${category.id}`)}
                >
                    <div className="menu-title-flex">
                        <img src={urlImageCategory + category.image} className="img-fluid user-avatar" alt="Hình ảnh" />
                        <p className="menu-title">{category.name}</p>
                    </div>
                </button>
            </li>
        ));
    };

    const renderBrands = () => {
        return brands.map(brand => (
            <li key={brand.id} className="dropdown-item">
                <button 
                    className="sidebar-accordion-menu" 
                    data-accordion-btn
                    onClick={() => navigate(`/product-of-brand/${brand.id}`)}
                >
                    <div className="menu-title-flex">
                        <img src={urlImageBrand + brand.image} className="img-fluid user-avatar" alt="Hình ảnh thương hiệu" />
                        <p className="menu-title">{brand.name}</p>
                    </div>
                </button>
            </li>
        ));
    };

    return (
        <>
         <div className="sidebar has-scrollbar" data-mobile-menu>
            <div className="sidebar-category">
                <h2 className="sidebar-title">Danh mục</h2>
                <ul className="sidebar-menu-category-list">
                    {renderCategories()}
                </ul>
            </div>
            <div className="sidebar-category">
                <h2 className="sidebar-title">Tác giả</h2>
                <ul className="sidebar-menu-category-list">
                    {renderBrands()}
                </ul>
            </div>
        </div>
        </>
    );
};

export default Sidebar;
