
"use client";

import AdminLayout from "@/components/AdminLayout";
import type { Product } from "@/lib/types";
import { Button, Card, Form, Input, InputNumber, Select, Table } from "antd";
import { useState } from "react";

type ProductFormValues = {
    name: string;
    sku: string;
    category: string;
    brand: string;
    basePrice: number;
    stock: number;
};

export default function ProductInputPage() {
    const [form] = Form.useForm<ProductFormValues>();
    const [products, setProducts] = useState<Product[]>([]);

    const handleSubmit = (values: ProductFormValues) => {
        const newProduct: Product = {
            id: `NEW-${Date.now()}`,
            name: values.name,
            sku: values.sku,
            slug: values.sku.toLowerCase(),
            category: values.category,
            brand: values.brand,
            basePrice: values.basePrice,
            stock: values.stock,
            isActive: true,
        };

        setProducts((prev) => [newProduct, ...prev]);
        form.resetFields();

        // 🔁 Later: call your API here to persist the product
        // await api.createProduct(newProductPayload)
    };

    return (
        <AdminLayout>
            <Card title="Product Input">
                <Form<ProductFormValues>
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Product Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter product name" }]}
                    >
                        <Input placeholder="Shockproof Case for iPhone 13" />
                    </Form.Item>

                    <Form.Item
                        label="SKU"
                        name="sku"
                        rules={[{ required: true, message: "Please enter SKU" }]}
                    >
                        <Input placeholder="CASE-IPH13-MAGSAFE" />
                    </Form.Item>

                    <Form.Item label="Category" name="category" initialValue="Cases">
                        <Select
                            options={[
                                { value: "Cases", label: "Cases" },
                                { value: "Chargers", label: "Chargers" },
                                { value: "Cables", label: "Cables" },
                                { value: "Screen Protectors", label: "Screen Protectors" },
                                { value: "Other", label: "Other" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item label="Brand" name="brand" initialValue="Apple">
                        <Select
                            showSearch
                            options={[
                                { value: "Apple", label: "Apple" },
                                { value: "Samsung", label: "Samsung" },
                                { value: "Xiaomi", label: "Xiaomi" },
                                { value: "OnePlus", label: "OnePlus" },
                                { value: "Universal", label: "Universal" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Base Price ($)"
                        name="basePrice"
                        rules={[{ required: true, message: "Please enter base price" }]}
                    >
                        <InputNumber
                            min={0}
                            step={0.01}
                            style={{ width: "100%" }}
                            prefix="$"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Initial Stock"
                        name="stock"
                        initialValue={0}
                        rules={[{ required: true, message: "Please enter stock" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Product
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card
                title="Session Products (mock only)"
                style={{ marginTop: 24 }}
                extra="These are only in memory – connect to your API to save."
            >
                <Table<Product>
                    rowKey="id"
                    dataSource={products}
                    pagination={{ pageSize: 10 }}
                    columns={[
                        { title: "Name", dataIndex: "name" },
                        { title: "SKU", dataIndex: "sku" },
                        { title: "Category", dataIndex: "category" },
                        { title: "Brand", dataIndex: "brand" },
                        {
                            title: "Base Price",
                            dataIndex: "basePrice",
                            render: (v) => `$${v.toFixed(2)}`,
                        },
                        { title: "Stock", dataIndex: "stock" },
                    ]}
                />
            </Card>
        </AdminLayout>
    );
}
