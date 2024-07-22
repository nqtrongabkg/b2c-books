import React from 'react';
import Sidebar from './productComponents/Sidebar';
import Minimal from './productComponents/Minimal';
import NewProducts from './productComponents/NewProducts';
// import Featured from './productcomponents/Featured';
// import Grid from './productcomponents/Grid';
import Sale from './productComponents/Sale';

const ProductsAtHome = () => {
    return (
        <div className="product-container">
        <div className="container">
            <Sidebar></Sidebar>
            <div className="product-box">
                <Minimal></Minimal>
                {/* <Featured></Featured> */}
                {/* <Grid></Grid> */}
                <Sale></Sale>
                <NewProducts></NewProducts>
            </div>
        </div>
        </div>

    );
};

export default ProductsAtHome;