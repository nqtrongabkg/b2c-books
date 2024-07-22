import React, { useState, useEffect } from 'react';

import CategoryService from '../../../services/CategoryService';
import BrandService from '../../../services/BrandService';
import TagService from '../../../services/TagService';
import InformationService from '../../../services/InformationService';
import { urlImageInformation } from '../../../config';

import { IonIcon } from '@ionic/react';
import { locationOutline, callOutline, mailOutline, logoLinkedin, logoFacebook, logoTwitter, logoInstagram } from 'ionicons/icons';

export default function Footer() {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [information, setInformation] = useState(null);

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
                console.error("Error fetching data:", error);
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
        const fetchInfor = async () => {
            try {
                let result = await InformationService.getDisplay();
                if(result){
                    console.log("inforrrrrrrrrrrrrrr:", result);
                    setInformation(result);
                }
            } catch (error) {
                console.error("Error fetching:", error);
            }
        };
        fetchInfor();
        fetchTags();
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    function formatDateToLocalDate(datetimeString) {
        const date = new Date(datetimeString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    }

    return (
        <>
            <footer>
                <div className="footer-nav">
                    <div className="container">
                        <ul className="footer-nav-list">
                            <li className="footer-nav-item">
                                <h2 className="nav-title">Danh mục phổ biến</h2>
                            </li>
                            {categories.map(category => (
                                <li key={category.id} className="footer-nav-item">
                                    <a href={`/product-of-category/${category.id}`} className="footer-nav-link">{category.name}</a>
                                </li>
                            ))}
                        </ul>
                        <ul className="footer-nav-list">

                            <li className="footer-nav-item">
                                <h2 className="nav-title">Thương hiệu nổi bật</h2>
                            </li>

                            {brands.map(brand => (
                                <li key={brand.id} className="footer-nav-item">
                                    <a href={`/product-of-brand/${brand.id}`} className="footer-nav-link">{brand.name}</a>
                                </li>
                            ))}
                        </ul>
                        <ul className="footer-nav-list">

                            <li className="footer-nav-item">
                                <h2 className="nav-title">Xu hướng</h2>
                            </li>
                            {tags.map(tag => (
                                <li key={tag.id} className="footer-nav-item">
                                    <a href={`/product-of-tag/${tag.id}`} className="footer-nav-link">{tag.name}</a>
                                </li>
                            ))}
                        </ul>

                        <ul className="footer-nav-list">

                            <li className="footer-nav-item">
                                <h2 className="nav-title">Liên hệ</h2>
                            </li>

                            <li className="footer-nav-item flex">
                                <div className="icon-box">
                                    <IonIcon icon={locationOutline} role="img" className="md hydrated" aria-label="location outline" />
                                </div>

                                <address className="content">
                                    {information.address ? information.address : ""}
                                </address>
                            </li>

                            <li className="footer-nav-item flex">
                                <div className="icon-box">
                                    <IonIcon icon={callOutline} role="img" className="md hydrated" aria-label="call outline" />
                                </div>

                                <a href="tel:+607936-8058" className="footer-nav-link">{information.phone ? information.phone : ""}</a>
                            </li>

                            <li className="footer-nav-item flex">
                                <div className="icon-box">
                                    <IonIcon icon={mailOutline} role="img" className="md hydrated" aria-label="mail outline" />
                                </div>

                                <a href="mailto:nqtrong68@gmail.com" className="">{information.email ? information.email :""}</a>
                            </li>

                        </ul>

                        <ul className="footer-nav-list">

                            <li className="footer-nav-item">
                                <h2 className="nav-title">Follow Us</h2>
                            </li>

                            <li>
                                <ul className="social-link">

                                    <li className="footer-nav-item">
                                        <a href="#tag" className="footer-nav-link">
                                            <IonIcon icon={logoFacebook} role="img" className="md hydrated" aria-label="logo facebook" />
                                        </a>
                                    </li>

                                    <li className="footer-nav-item">
                                        <a href="#tag" className="footer-nav-link">
                                            <IonIcon icon={logoTwitter} role="img" className="md hydrated" aria-label="logo twitter" />
                                        </a>
                                    </li>

                                    <li className="footer-nav-item">
                                        <a href="#tag" className="footer-nav-link">
                                            <IonIcon icon={logoLinkedin} role="img" className="md hydrated" aria-label="logo linkedin" />
                                        </a>
                                    </li>

                                    <li className="footer-nav-item">
                                        <a href="#tag" className="footer-nav-link">
                                            <IonIcon icon={logoInstagram} role="img" className="md hydrated" aria-label="logo instagram" />
                                        </a>
                                    </li>

                                </ul>
                            </li>

                        </ul>

                    </div>

                </div>

                <div className="footer-bottom">
                    <div className="container">
                        <img src={urlImageInformation + information.logo} alt="payment method" className="payment-img" />
                        <div className="container" style={{ color: 'white', lineHeight: '0.7', marginBottom: '5px' }}>
                            <p className="copyright">Địa chỉ: {information.address ? information.address : "Not found"}</p>
                            <p className="copyright">Email: {information.email ? information.email : "Not found"}</p>
                            <p className="copyright">Điện thoại: {information.phone ? information.phone : "Not found"}</p>
                            <p className="copyright">Chịu Trách Nhiệm Quản Lý Nội Dung: {information.repersent ? information.repersent : "Not found"} - Điện thoại liên hệ: {information.repersentPhone ? information.repersentPhone : "Not found"}</p>
                            <p className="copyright">Mã số doanh nghiệp: {information.businessNumber ? information.businessNumber : "Not found"} được cấp bởi CQCGP vào ngày {formatDateToLocalDate(information.createdAt ? information.createdAt : "Not found")}</p>
                            <p className="copyright">Giấy phép kinh doanh: {information.license ? information.license : "Not found"} được cấp bởi CQCGP vào ngày {formatDateToLocalDate(information.createdAt ? information.createdAt : "Not found")}</p>
                            <p className="copyright">Copyright © 2024 - Bản quyền thuộc về {information.name ? information.name : "Not found"}</p>
                        </div>

                    </div>

                </div>

            </footer>
        </>
    );
}
