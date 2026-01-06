"use client";

import AdminLayout from "@/components/AdminLayout";
import { createProduct } from "@/lib/api";
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
} from "antd";
import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { TextArea } = Input;

export default function NewProductPage() {
    const router = useRouter();
    const [form] = Form.useForm<Product>();

    const handleSubmit = async (values: any) => {
        try {
            await createProduct(values);
            message.success("Product created successfully");
            router.push("/products");
        } catch (error) {
            message.error("Failed to create product");
        }
    };

    return (
        <AdminLayout>
            <Card
                title="Create Product"
                extra={
                    <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
                        Back
                    </Button>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        isActive: true,
                        isFeatured: false,
                        isNew: false,
                        isBestseller: false,
                        stock: 0,
                        lowStockThreshold: 10,
                    }}
                >
                    <Divider orientation="left">Basic Info</Divider>
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

                        <Divider orientation="left">Device Info</Divider>
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

                        <Divider orientation="left">Pricing</Divider>
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

                        <Divider orientation="left">Inventory</Divider>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <Form.Item name="stock" label="Total Stock" rules={[{ required: true }]}>
                                <InputNumber min={0} style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name="lowStockThreshold" label="Low Stock Threshold">
                                <InputNumber min={0} style={{ width: "100%" }} />
                            </Form.Item>
                        </div>

                        <Divider orientation="left">Media</Divider>
                        <Form.Item name="thumbnail" label="Thumbnail URL">
                            <Input placeholder="https://example.com/image.jpg" />
                        </Form.Item>
                        <Form.Item name="images" label="Additional Images">
                            <Upload multiple>
                                <Button icon={<UploadOutlined />}>Upload Images</Button>
                            </Upload>
                        </Form.Item>

                        <Divider orientation="left">Details</Divider>
                        <Form.Item name="description" label="Description">
                            <TextArea rows={4} placeholder="Product description" />
                        </Form.Item>
                        <Form.Item name="specifications" label="Specifications (JSON)">
                            <TextArea
                                rows={6}
                                placeholder='{"color": "Black", "storage": "256GB", "display": "6.1 inch"}'
                            />
                        </Form.Item>

                        <Divider orientation="left">SEO</Divider>
                        <Form.Item name="metaTitle" label="Meta Title">
                            <Input placeholder="SEO title" />
                        </Form.Item>
                        <Form.Item name="metaDescription" label="Meta Description">
                            <TextArea rows={2} placeholder="SEO description" />
                        </Form.Item>

                        <Divider orientation="left">Flags</Divider>
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
                                    Create Product
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
