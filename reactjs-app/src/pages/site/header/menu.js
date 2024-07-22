import React, { useState, useEffect } from 'react';
import CategoryService from '../../../services/CategoryService';
import BrandService from '../../../services/BrandService';
import TagService from '../../../services/TagService';
import '../../../assets/styles/menu.css';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const categoriesResult = await CategoryService.getAll();
                const brandsResult = await BrandService.getAll();

                const filteredCategories = categoriesResult.filter(category => category.status >= 3);
                const filteredBrands = brandsResult.filter(brand => brand.status >= 3);

                // Sort categories by productQuantity in descending order
                const sortedCategories = filteredCategories.sort((a, b) => b.productQuantity - a.productQuantity);

                setCategories(sortedCategories);
                setBrands(filteredBrands);
            } catch (error) {
                if (error.response && error.response.status === 503) {
                    navigate('/404');
                } else {
                    console.error("Error fetching data:", error);
                }
            }
            setLoading(false);
        };
        const fetchTags = async () => {
            try {
                let result = await TagService.getAll();
                const sortedtags = result.filter(brand => brand.status >= 3);
                setTags(sortedtags);
            } catch (error) {
                console.error("Error fetching:", error);
            }
        };
        fetchTags();
        fetchData();
    }, []);

    const renderCategories = () => {
        return categories.map(category => (
            <li key={category.id} className="dropdown-item">
                <a href={`/product-of-category/${category.id}`} className="menu-title">{category.name}</a>
            </li>
        ));
    };

    const renderBrands = () => {
        return brands.map(brand => (
            <li key={brand.id} className="dropdown-item">
                <a href={`/product-of-brand/${brand.id}`} className="menu-title">{brand.name}</a>
            </li>
        ));
    };

    const renderTags = () => {
        return tags.map(tag => (
            <li key={tag.id} className="dropdown-item">
                <a href={`/product-of-tag/${tag.id}`} className="menu-title">{tag.name}</a>
            </li>
        ));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ul className="desktop-menu-category-list">
            <li className="menu-category">
                <a href="/" className="menu-title">Trang chủ</a>
            </li>
            <li className="menu-category">
                <a href="#nqt" className="menu-title">Danh mục</a>
                <ul className="dropdown-list">
                    {renderCategories()}
                </ul>
            </li>
            <li className="menu-category">
                <a href="#nqt" className="menu-title">Tác giả</a>
                <ul className="dropdown-list">
                    {renderBrands()}
                </ul>
            </li>
            <li className="menu-category">
                <a href="#nqt" className="menu-title">Nhà xuất bản</a>
                <ul className="dropdown-list">
                    {renderTags()}
                </ul>
            </li>
        </ul>
    );
};

export default Menu;
