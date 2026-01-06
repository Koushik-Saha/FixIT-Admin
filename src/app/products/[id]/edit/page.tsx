"use client";

import AdminLayout from "@/components/AdminLayout";
import { getProduct, updateProduct } from "@/lib/api";
import type { Product } from "@/lib/types";
import {
    Button,
    Card,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Upload,
    message,
    Space,
    Divider,
    Spin,
} from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const { TextArea } = Input;

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const [form] = Form.useForm<Product>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const product = await getProduct(params.id as string) as Product;
                form.setFieldsValue(product);
            } catch (error) {
                message.error("Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [params.id, form]);

    const handleSubmit = async (values: any) => {
        try {
            await updateProduct(params.id as string, values);
            message.success("Product updated successfully");
            router.push("/products");
        } catch (error) {
            message.error("Failed to update product");
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <Card>
                    <div style={{ textAlign: "center", padding: 50 }}>
                        <Spin size="large" />
                    </div>
                </Card>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Card
                title="Edit Product"
                extra={
                    <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
                        Back
                    </Button>
                }
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Divider>Basic Info</Divider>
                    <Space direction="vertical" style={{ width: "100%" }} size="large">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                                <Input placeholder="iPhone 14 Pro" />
                            </Form.Item>
                            <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
                                <Input placeholder="IPH14P-256-BLK" />
                            </Form.Item>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                                <Input placeholder="iphone-14-pro" />
                            </Form.Item>
                            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Select category"
                                    options={[
                                        { label: "Smartphones", value: "smartphones" },
                                        { label: "Tablets", value: "tablets" },
                                        { label: "Laptops", value: "laptops" },
                                        { label: "Accessories", value: "accessories" },
                                        { label: "Parts", value: "parts" },
                                    ]}
                                />
                            </Form.Item>
                        </div>

                        <Divider>Device Info</Divider>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                            <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Select brand"
                                    options={[
                                        { label: "Apple", value: "Apple" },
                                        { label: "Samsung", value: "Samsung" },
                                        { label: "Google", value: "Google" },
                                        { label: "OnePlus", value: "OnePlus" },
                                        { label: "Other", value: "Other" },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item name="model" label="Model">
                                <Input placeholder="14 Pro" />
                            </Form.Item>
                            <Form.Item name="productType" label="Product Type">
                                <Input placeholder="Unlocked" />
                            </Form.Item>
                        </div>

                        <Divider>Pricing</Divider>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <Form.Item name="basePrice" label="Base Price" rules={[{ required: true }]}>
                                <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name="costPrice" label="Cost Price">
                                <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                            </Form.Item>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                            <Form.Item name={["wholesaleDiscounts", "tier1"]} label="Tier 1 Discount (%)">
                                <InputNumber min={0} max={100} style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name={["wholesaleDiscounts", "tier2"]} label="Tier 2 Discount (%)">
                                <InputNumber min={0} max={100} style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name={["wholesaleDiscounts", "tier3"]} label="Tier 3 Discount (%)">
                                <InputNumber min={0} max={100} style={{ width: "100%" }} />
                            </Form.Item>
                        </div>

                        <Divider>Inventory</Divider>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <Form.Item name="stock" label="Total Stock" rules={[{ required: true }]}>
                                <InputNumber min={0} style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name="lowStockThreshold" label="Low Stock Threshold">
                                <InputNumber min={0} style={{ width: "100%" }} />
                            </Form.Item>
                        </div>

                        <Divider>Media</Divider>
                        <Form.Item name="thumbnail" label="Thumbnail URL">
                            <Input placeholder="https://example.com/image.jpg" />
                        </Form.Item>
                        <Form.Item name="images" label="Additional Images">
                            <Upload multiple>
                                <Button icon={<UploadOutlined />}>Upload Images</Button>
                            </Upload>
                        </Form.Item>

                        <Divider>Details</Divider>
                        <Form.Item name="description" label="Description">
                            <TextArea rows={4} placeholder="Product description" />
                        </Form.Item>
                        <Form.Item name="specifications" label="Specifications (JSON)">
                            <TextArea
                                rows={6}
                                placeholder='{"color": "Black", "storage": "256GB", "display": "6.1 inch"}'
                            />
                        </Form.Item>

                        <Divider>SEO</Divider>
                        <Form.Item name="metaTitle" label="Meta Title">
                            <Input placeholder="SEO title" />
                        </Form.Item>
                        <Form.Item name="metaDescription" label="Meta Description">
                            <TextArea rows={2} placeholder="SEO description" />
                        </Form.Item>

                        <Divider>Flags</Divider>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                            <Form.Item name="isActive" label="Active" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                            <Form.Item name="isFeatured" label="Featured" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                            <Form.Item name="isNew" label="New" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                            <Form.Item name="isBestseller" label="Bestseller" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </div>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Update Product
                                </Button>
                                <Button onClick={() => router.back()}>Cancel</Button>
                            </Space>
                        </Form.Item>
                    </Space>
                </Form>
            </Card>
        </AdminLayout>
    );
}
