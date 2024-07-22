import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import '../../assets/styles/productdetails.css';
import Content from "./productDetails/Content";
import ProductGallery from "./productDetails/ProductGallery";
import ProductSimilar from "./productDetails/ProductSimilar";

const ProductDetails = () => {
    const location = useLocation();

    // Scroll to the top of the page every time the location changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div>
            <ProductGallery />
            <Content />
            <div className="container">
                <ProductSimilar/>
            </div>
        </div>
    );
};

export default ProductDetails;
