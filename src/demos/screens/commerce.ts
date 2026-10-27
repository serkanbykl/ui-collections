import type { DemoMap } from "../types";
import ScreenProductsDemo from "./screen-products";
import ScreenProductDetailDemo from "./screen-product-detail";
import ScreenProductFormDemo from "./screen-product-form";
import ScreenOrdersDemo from "./screen-orders";
import ScreenOrderDetailDemo from "./screen-order-detail";
import ScreenCustomersDemo from "./screen-customers";
import ScreenCustomerDetailDemo from "./screen-customer-detail";
import ScreenStoreDemo from "./screen-store";
import ScreenStoreProductDemo from "./screen-store-product";
import ScreenStoreCartDemo from "./screen-store-cart";
import ScreenStoreCheckoutDemo from "./screen-store-checkout";
import ScreenStoreConfirmationDemo from "./screen-store-confirmation";
import ScreenInvoicesDemo from "./screen-invoices";
import ScreenInvoicePreviewDemo from "./screen-invoice-preview";
import ScreenInvoiceEditorDemo from "./screen-invoice-editor";
import ScreenDashboardEcommerceDemo from "./screen-dashboard-ecommerce";
import ScreenDashboardCrmDemo from "./screen-dashboard-crm";
import ScreenDashboardProjectsDemo from "./screen-dashboard-projects";

export const commerceScreenDemos: DemoMap = {
  "screen-products": ScreenProductsDemo,
  "screen-product-detail": ScreenProductDetailDemo,
  "screen-product-form": ScreenProductFormDemo,
  "screen-orders": ScreenOrdersDemo,
  "screen-order-detail": ScreenOrderDetailDemo,
  "screen-customers": ScreenCustomersDemo,
  "screen-customer-detail": ScreenCustomerDetailDemo,
  "screen-store": ScreenStoreDemo,
  "screen-store-product": ScreenStoreProductDemo,
  "screen-store-cart": ScreenStoreCartDemo,
  "screen-store-checkout": ScreenStoreCheckoutDemo,
  "screen-store-confirmation": ScreenStoreConfirmationDemo,
  "screen-invoices": ScreenInvoicesDemo,
  "screen-invoice-preview": ScreenInvoicePreviewDemo,
  "screen-invoice-editor": ScreenInvoiceEditorDemo,
  "screen-dashboard-ecommerce": ScreenDashboardEcommerceDemo,
  "screen-dashboard-crm": ScreenDashboardCrmDemo,
  "screen-dashboard-projects": ScreenDashboardProjectsDemo,
};
