import React, { useEffect, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { Link } from 'react-router-dom';
import { star, starOutline, bagAddOutline, repeatOutline, eyeOutline, heartOutline } from 'ionicons/icons';
import ProductService from '../../../../services/ProductService';
import { urlImageProduct } from '../../../../config';

const Grid = () => {
    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let result = await ProductService.getnew();
                result = result.filter(product => product.status !== 2);
                const sortedProducts = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setProducts(sortedProducts);
            } catch (error) {
                console.error("Error fetching:", error);
            }
        };
        fetchProducts();
    }, [reload]);

    return (
        <div className="product-main">
            <h2 className="title">New Products</h2>
            <div className="product-grid">
                {products.map(product => (
                    <div className="showcase" key={product.id}>
                        <div className="showcase-banner">
                        <img src={urlImageProduct + product.image}  width={300} className="product-img default" />
                        <img src={urlImageProduct + product.image}  width={300} className="product-img hover" />
                            <p className="showcase-badge">New</p>
                            <div className="showcase-actions">
                                <button className="btn-action">
                                    <IonIcon icon={heartOutline} />
                                </button>
                                <button className="btn-action">
                                <Link to={'/productdetail/' + product.id}>
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
                            <a href="#nqtnqtnqtnqtnqtnqtnqtnqtnqtnqtnqtnqtnqtnqt" className="showcase-category">{product.category}</a>
                            <a href="#nqtnqtnqtnqtnqtnqtnqtnqtnqtnqtnqtnqtnqtnqt">
                                <h3 className="showcase-title">{product.name}</h3>
                            </a>
                            <a href="#nqtnqtnqtnqtnqtnqtnqtnqtnqtnqtnqtnqtnqtnqt">
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
                                <p className="price">${product.price}</p>
                                <del>${product.previousPrice}</del>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Grid;
