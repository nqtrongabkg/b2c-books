import Home from "../pages/site/Home";
import OrderItemDetail from "../pages/site/OrderItemDetail";
import ProductDetails from "../pages/site/ProductDetails";
import Productfortune from "../pages/site/Productfortune";
import ShoppingCart from "../pages/site/Cart";
import Login from "../layouts/LayoutSite/Login";
import MyUser from "../pages/site/MyUser";
import RegisterUser from "../layouts/LayoutSite/RegisterUser";
import UserManager from "../pages/site/UserManager";
import RegisterStore from "../pages/site/RegisterStore";
import FavoriteProduct from "../pages/site/FavoriteProduct";
import CreateFeedback from "../pages/site/CreateFeedback";
import ProductOfCategoryPage from "../pages/site/ProductOfCategoryPage";
import ProductOfBrandPage from "../pages/site/ProductOfBrandPage";
import ProductOfTagPage from "../pages/site/ProductOfTagPage";
import ProductOfShop from "../pages/site/ProductOfShop";
import ErrorPage from "../pages/site/ErrorPage";

const RouteSite = [

    { path: '*', component: ErrorPage },

    { path: '/', component: Home },

    { path: '/my-user', component: MyUser },

    { path: '/my-user-manager', component: UserManager },

    { path: '/login', component: Login },

    { path: '/register', component: RegisterUser },

    { path: '/register-store/:id', component: RegisterStore },

    { path: '/product-detail/:id', component: ProductDetails },

    { path: '/productfortune', component: Productfortune },

    { path: '/shopping-cart', component: ShoppingCart },

    { path: '/favorite', component: FavoriteProduct },

    { path: '/order-item-detail/:id', component: OrderItemDetail },

    { path: '/create-feedback', component: CreateFeedback },

    { path: '/product-of-category/:id', component: ProductOfCategoryPage },

    { path: '/product-of-brand/:id', component: ProductOfBrandPage },
    
    { path: '/product-of-tag/:id', component: ProductOfTagPage },

    { path: '/product-of-shop/:id', component: ProductOfShop },
];
export default RouteSite;