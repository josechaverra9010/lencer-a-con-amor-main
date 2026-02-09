import axios from "axios";
import { Product } from "@/data/products";

const API_URL = import.meta.env.VITE_API_URL || "https://lencer-a-con-amor-main-ooys.vercel.app/api";

export const api = axios.create({
    baseURL: API_URL,
});

export const getProducts = async (category?: string) => {
    const params = category && category !== "Todos" ? { category } : {};
    const response = await api.get<any[]>("/products", { params });
    return response.data.map(p => ({
        ...p,
        originalPrice: p.original_price,
        isNew: p.is_new,
        isSale: p.is_sale,
        // Keep p.category if it's already an object, but also provide name for easy display
        category: typeof p.category === 'object' ? p.category.name : p.category
    })) as Product[];
};

export const getProductById = async (id: string | number) => {
    const response = await api.get<any>(`/products/${id}`);
    const p = response.data;
    return {
        ...p,
        originalPrice: p.original_price,
        isNew: p.is_new,
        isSale: p.is_sale,
        category: typeof p.category === 'object' ? p.category.name : p.category
    } as Product;
};

export const getCategories = async () => {
    const response = await api.get<{ id: number; name: string }[]>("/categories");
    return response.data;
};
export const getColors = async () => {
    const response = await api.get<{ id: number; name: string; value: string }[]>("/colors");
    return response.data;
};

export const createOrder = async (orderData: any) => {
    const response = await api.post("/orders", orderData);
    return response.data;
};

export const getUserOrders = async (userId: string | number) => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
};

export const getOrderById = async (orderId: string | number, email: string) => {
    const response = await api.get(`/orders/${orderId}`, { params: { email } });
    return response.data;
};

// Admin Endpoints
export const getAdminOrders = async () => {
    const response = await api.get("/admin/orders");
    return response.data;
};

export const getAdminUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
};

export const updateProduct = async (productId: number, productData: any) => {
    const response = await api.put(`/admin/products/${productId}`, productData);
    return response.data;
};

export const deleteProduct = async (productId: number) => {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
};

export const getAdminStats = async () => {
    const response = await api.get("/admin/stats");
    return response.data;
};

export const createProduct = async (productData: any) => {
    const response = await api.post("/products", productData);
    return response.data;
};

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const recordVisit = async () => {
    try {
        await api.post("/record-visit");
    } catch (error) {
        console.error("Error recording visit:", error);
    }
};
