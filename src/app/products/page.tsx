"use client";

import AdminLayout from "@/components/AdminLayout";
import { fetchProducts } from "@/lib/mockApi";
import type { Product } from "@/lib/types";
import {
    Button,
    Card,
    Input,
    Modal,
    Space,
    Table,
    Tag,
    Form,
    InputNumber,
    Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form] = Form.useForm<Product>();

    useEffect(() => {
        fetchProducts().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    const handleOpenCreate = () => {
        setEditingProduct(null);
        form.resetFields();
        setOpenModal(true);
    };

    const handleEdit = (record: Product) => {
        setEditingProduct(record);
        form.setFieldsValue(record);
        setOpenModal(true);
    };

    const handleSubmit = (values: Product) => {
        // Mock local update; later replace with API call.
        if (editingProduct) {
            setProducts((prev) =>
                prev.map((p) => (p.id === editingProduct.id ? { ...editingProduct, ...values } : p)),
            );
        } else {
            setProducts((prev) => [
                ...prev,
                {
                    ...values,
                    id: `p-${prev.length + 1}`,
                },
            ]);
        }
        setOpenModal(false);
    };

    return (
        <AdminLayout>
            <Card
                title="Product Management"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleOpenCreate}
                    >
                        New Product
                    </Button>
                }
            >
                <Table<Product>
                    rowKey="id"
                    loading={loading}
                    dataSource={products}
                    pagination={{ pageSize: 10 }}
                    columns={[
                        { title: "Name", dataIndex: "name" },
                        { title: "SKU", dataIndex: "sku" },
                        { title: "Category", dataIndex: "category" },
                        { title: "Brand", dataIndex: "brand" },
                        {
                            title: "Retail",
                            dataIndex: "price",
                            render: (v) => `$${v.toFixed(2)}`,
                        },
                        {
                            title: "Wholesale",
                            dataIndex: "wholesalePrice",
                            render: (v) => `$${v.toFixed(2)}`,
                        },
                        {
                            title: "Stock",
                            dataIndex: "stock",
                        },
                        {
                            title: "Status",
                            dataIndex: "status",
                            render: (status) => (
                                <Tag
                                    color={
                                        status === "active"
                                            ? "green"
                                            : status === "draft"
                                                ? "gold"
                                                : "red"
                                    }
                                >
                                    {status.toUpperCase()}
                                </Tag>
                            ),
                        },
                        {
                            title: "Actions",
                            render: (_, record) => (
                                <Space>
                                    <Button size="small" onClick={() => handleEdit(record)}>
                                        Edit
                                    </Button>
                                    <Button size="small" danger>
                                        Archive
                                    </Button>
                                </Space>
                            ),
                        },
                    ]}
                />
            </Card>

            <Modal
                title={editingProduct ? "Edit Product" : "New Product"}
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onOk={() => form.submit()}
                okText="Save"
            >
                <Form<Product>
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        status: "active",
                    }}
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="category" label="Category">
                        <Input />
                    </Form.Item>
                    <Form.Item name="brand" label="Brand">
                        <Input />
                    </Form.Item>
                    <Form.Item name="price" label="Retail Price" rules={[{ required: true }]}>
                        <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        name="wholesalePrice"
                        label="Wholesale Price"
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="status" label="Status">
                        <Select
                            options={[
                                { value: "active", label: "Active" },
                                { value: "draft", label: "Draft" },
                                { value: "archived", label: "Archived" },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}
