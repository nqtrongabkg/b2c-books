import React from "react";
import Slider from "./homeComponents/Slider";
import Category from "./homeComponents/Category";
import ProductsAtHome from "./homeComponents/ProductsAtHome";
// import Blog from "./homeComponents/Blog";
import Testimonials from "./homeComponents/Testimonials";

const Home = () => {
    return (
        <>
        <Slider></Slider>
        <Category></Category>
        <ProductsAtHome></ProductsAtHome>
        <Testimonials></Testimonials>  
        {/* <Blog></Blog>   */}
        </>
    );
};
export default Home;