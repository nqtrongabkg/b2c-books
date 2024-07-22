
import UserIndex from "../pages/admin/user/UserIndex";
import UserAdd from "../pages/admin/user/UserAdd";
import UserEdit from "../pages/admin/user/UserEdit";
import UserTrash from "../pages/admin/user/UserTrash";

import RoleAdd from "../pages/admin/role/RoleAdd";
import RoleEdit from "../pages/admin/role/RoleEdit";
import RoleIndex from "../pages/admin/role/RoleIndex";
import RoleTrash from "../pages/admin/role/RoleTrash";

import StaffAdd from "../pages/admin/staff/StaffAdd";
import StaffIndex from "../pages/admin/staff/StaffIndex";
import StaffTrash from "../pages/admin/staff/StaffTrash";
import StaffEdit from "../pages/admin/staff/StaffEdit";

import NotificationIndex from "../pages/admin/notification/NotificationIndex";
import NotificationAdd from "../pages/admin/notification/NotificationAdd";
import NotificationEdit from "../pages/admin/notification/NotificationEdit";
import NotificationTrash from "../pages/admin/notification/NotificationTrash";

import BrandAdd from "../pages/admin/brand/BrandAdd";
import BrandEdit from "../pages/admin/brand/BrandEdit";
import BrandIndex from "../pages/admin/brand/BrandIndex";
import BrandTrash from "../pages/admin/brand/BrandTrash";

import CategoryAdd from "../pages/admin/category/CategoryAdd";
import CategoryEdit from "../pages/admin/category/CategoryEdit";
import CategoryIndex from "../pages/admin/category/CategoryIndex";
import CategoryTrash from "../pages/admin/category/CategoryTrash";

import TagAdd from "../pages/admin/tag/TagAdd";
import TagEdit from "../pages/admin/tag/TagEdit";
import TagIndex from "../pages/admin/tag/TagIndex";
import TagTrash from "../pages/admin/tag/TagTrash";

import ProductAdd from "../pages/admin/product/ProductAdd";
import ProductEdit from "../pages/admin/product/ProductEdit";
import ProductIndex from "../pages/admin/product/ProductIndex";
import ProductTrash from "../pages/admin/product/ProductTrash";
import ProductSaleTrash from "../pages/admin/product/ProductSaleTrash";
import ProductSaleAdd from "../pages/admin/product/ProductSaleAdd";
import ProductSaleIndex from "../pages/admin/product/ProductSaleIndex";
import ProductSaleEdit from "../pages/admin/product/ProductSaleEdit";
import ProductOptionAdd from "../pages/admin/product/ProductOptionAdd";
import ProductOptionIndex from "../pages/admin/product/ProductOptionIndex";
import ProductOptionEdit from "../pages/admin/product/ProductOptionEdit";
import ProductOptionTrash from "../pages/admin/product/ProductOptionTrash";
import ProductGallaryIndex from "../pages/admin/product/ProductGallaryIndex";
import ProductStoreIndex from "../pages/admin/store/ProductStoreIndex";
import ProductStoreEdit from "../pages/admin/store/ProductStoreEdit";
import ProductImportAdd from "../pages/admin/store/ProductImportAdd";
import ProductImportIndex from "../pages/admin/store/ProductImportIndex";
import ProductImportEdit from "../pages/admin/store/ProductImportEdit";

import SliderIndex from "../pages/admin/slider/SliderIndex";
import SliderAdd from "../pages/admin/slider/SliderAdd";
import SliderEdit from "../pages/admin/slider/SliderEdit";
import SliderTrash from "../pages/admin/slider/SliderTrash";

import BannerIndex from "../pages/admin/banner/BannerIndex";
import BannerAdd from "../pages/admin/banner/BannerAdd";
import BannerEdit from "../pages/admin/banner/BannerEdit";
import BannerTrash from "../pages/admin/banner/BannerTrash";

import InformationIndex from "../pages/admin/information/InformationIndex";
import InformationAdd from "../pages/admin/information/InformationAdd";
import InformationEdit from "../pages/admin/information/InformationEdit";
import InformationTrash from "../pages/admin/information/InformationTrash";

import OrderItemIndex from "../pages/admin/orderItem/OrderItemIndex";
import OrderItemTrash from "../pages/admin/orderItem/OrderItemTrash";
import ProductExportIndex from "../pages/admin/store/ProductExportIndex";

import ErrorPage from "../pages/site/ErrorPage";

const RouteAdmin = [
    { path: '/admin/*', component: ErrorPage },
    //user
    { path: '/admin/user/index', component: UserIndex },
    { path: '/admin/user/trash', component: UserTrash },
    { path: '/admin/user/add', component: UserAdd },
    { path: '/admin/user/edit/:id', component: UserEdit },
    //staff
    { path: '/admin/staff/index', component: StaffIndex },
    { path: '/admin/staff/trash', component: StaffTrash },
    { path: '/admin/staff/add', component: StaffAdd },
    { path: '/admin/staff/edit/:id', component: StaffEdit },
    //role
    { path: '/admin/role/index', component: RoleIndex },
    { path: '/admin/role/trash', component: RoleTrash },
    { path: '/admin/role/add', component: RoleAdd },
    { path: '/admin/role/edit/:id', component: RoleEdit },
    //notification
    { path: '/admin/notification/index', component: NotificationIndex },
    { path: '/admin/notification/trash', component: NotificationTrash },
    { path: '/admin/notification/add/:id', component: NotificationAdd },
    { path: '/admin/notification/edit/:id', component: NotificationEdit },
    //brand
    { path: '/admin/brand/index', component: BrandIndex },
    { path: '/admin/brand/trash', component: BrandTrash },
    { path: '/admin/brand/add', component: BrandAdd },
    { path: '/admin/brand/edit/:id', component: BrandEdit },
    //category
    { path: '/admin/category/index', component: CategoryIndex },
    { path: '/admin/category/trash', component: CategoryTrash },
    { path: '/admin/category/add', component: CategoryAdd },
    { path: '/admin/category/edit/:id', component: CategoryEdit },
    //tag
    { path: '/admin/tag/index', component: TagIndex },
    { path: '/admin/tag/trash', component: TagTrash },
    { path: '/admin/tag/add', component: TagAdd },
    { path: '/admin/tag/edit/:id', component: TagEdit },
    //product
    { path: '/admin/product/index', component: ProductIndex },
    { path: '/admin/product/add', component: ProductAdd },
    { path: '/admin/product/edit/:id', component: ProductEdit },
    { path: '/admin/product/trash', component: ProductTrash },
    //product sale
    { path: '/admin/product/sale-index', component: ProductSaleIndex },
    { path: '/admin/product/sale-trash', component: ProductSaleTrash },
    { path: '/admin/product/sale-add/:id', component: ProductSaleAdd },
    { path: '/admin/product/sale-edit/:id', component: ProductSaleEdit },
    //product option
    { path: '/admin/product/option-index', component: ProductOptionIndex },
    { path: '/admin/product/option-edit/:id', component: ProductOptionEdit },
    { path: '/admin/product/option-add/:id', component: ProductOptionAdd },
    { path: '/admin/product/option-trash', component: ProductOptionTrash },
    //product gallary
    { path: '/admin/product/gallary-index/:id', component: ProductGallaryIndex },
    //product store
    { path: '/admin/product/store/index', component: ProductStoreIndex },
    { path: '/admin/product/import/index', component: ProductImportIndex },
    { path: '/admin/product/store/edit/:id', component: ProductStoreEdit },
    { path: '/admin/product/import/add/:id', component: ProductImportAdd },
    { path: '/admin/product/import/edit/:id', component: ProductImportEdit },
    //slider
    { path: '/admin/slider/index', component: SliderIndex },
    { path: '/admin/slider/trash', component: SliderTrash },
    { path: '/admin/slider/add', component: SliderAdd },
    { path: '/admin/slider/edit/:id', component: SliderEdit },
    //banner
    { path: '/admin/banner/index', component: BannerIndex },
    { path: '/admin/banner/trash', component: BannerTrash },
    { path: '/admin/banner/add', component: BannerAdd },
    { path: '/admin/banner/edit/:id', component: BannerEdit },
    //information
    { path: '/admin/information/index', component: InformationIndex },
    { path: '/admin/information/trash', component: InformationTrash },
    { path: '/admin/information/add', component: InformationAdd },
    { path: '/admin/information/edit/:id', component: InformationEdit },
    //order-item
    { path: '/admin/order-item/index', component: OrderItemIndex },
    { path: '/admin/order-item/trash', component: OrderItemTrash },
    //order-export
    { path: '/admin/order/export', component: ProductExportIndex },
];
export default RouteAdmin;
