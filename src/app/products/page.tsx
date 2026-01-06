"use client";

import AdminLayout from "@/components/AdminLayout";
import { getProducts, deleteProduct } from "@/lib/api";
import type { Product } from "@/lib/types";
import {
    Button,
    Card,
    Input,
    Space,
    Table,
    Tag,
    Select,
    message,
    Popconfirm,
    Image,
} from "antd";
import { PlusOutlined, SearchOutlined, UploadOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";

const { Search } = Input;

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [brandFilter, setBrandFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [stockFilter, setStockFilter] = useState<string | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (searchText) params.search = searchText;
            if (categoryFilter) params.category = categoryFilter;
            if (brandFilter) params.brand = brandFilter;
            if (statusFilter) params.status = statusFilter;
            if (stockFilter) params.stock = stockFilter;

            const data = await getProducts(params) as Product[];
            setProducts(data);
        } catch (error) {
            message.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [searchText, categoryFilter, brandFilter, statusFilter, stockFilter]);

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id);
            message.success("Product deleted");
            loadProducts();
        } catch (error) {
            message.error("Failed to delete product");
        }
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedRowKeys.map(id => deleteProduct(id as string)));
            message.success(`${selectedRowKeys.length} products deleted`);
            setSelectedRowKeys([]);
            loadProducts();
        } catch (error) {
            message.error("Failed to delete products");
        }
    };

    const categories = [...new Set(products.map(p => p.category))];
    const brands = [...new Set(products.map(p => p.brand))];

    const columns: TableColumnsType<Product> = [
        {
            title: "Image",
            dataIndex: "thumbnail",
            width: 80,
            render: (url) => url ? <Image src={url} width={50} height={50} alt="" /> : "-",
        },
        {
            title: "SKU",
            dataIndex: "sku",
            width: 120,
        },
        {
            title: "Name",
            dataIndex: "name",
            width: 200,
        },
        {
            title: "Brand",
            dataIndex: "brand",
            width: 120,
        },
        {
            title: "Model",
            dataIndex: "model",
            width: 120,
        },
        {
            title: "Category",
            dataIndex: "category",
            width: 120,
        },
        {
            title: "Stock",
            dataIndex: "stock",
            width: 80,
            render: (stock, record) => (
                <span style={{ color: record.lowStockThreshold && stock <= record.lowStockThreshold ? '#ff4d4f' : undefined }}>
                    {stock}
                </span>
            ),
        },
        {
            title: "Price",
            dataIndex: "basePrice",
            width: 100,
            render: (v) => `$${v.toFixed(2)}`,
        },
        {
            title: "Status",
            dataIndex: "isActive",
            width: 100,
            render: (isActive) => (
                <Tag color={isActive ? "green" : "red"}>
                    {isActive ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Actions",
            width: 150,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Button size="small" onClick={() => router.push(`/products/${record.id}/edit`)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button size="small" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Card
                title="Products"
                extra={
                    <Space>
                        <Button
                            icon={<UploadOutlined />}
                            onClick={() => router.push("/products/bulk-import")}
                        >
                            Bulk Import
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => router.push("/products/new")}
                        >
                            New Product
                        </Button>
                    </Space>
                }
            >
                <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }} size="middle">
                    <Search
                        placeholder="Search by name, SKU, brand, model"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchText}
                        style={{ maxWidth: 400 }}
                    />

                    <Space wrap>
                        <Select
                            placeholder="Category"
                            allowClear
                            style={{ width: 150 }}
                            onChange={setCategoryFilter}
                            options={categories.map(c => ({ label: c, value: c }))}
                        />
                        <Select
                            placeholder="Brand"
                            allowClear
                            style={{ width: 150 }}
                            onChange={setBrandFilter}
                            options={brands.map(b => ({ label: b, value: b }))}
                        />
                        <Select
                            placeholder="Status"
                            allowClear
                            style={{ width: 150 }}
                            onChange={setStatusFilter}
                            options={[
                                { label: "Active", value: "active" },
                                { label: "Inactive", value: "inactive" },
                            ]}
                        />
                        <Select
                            placeholder="Stock Level"
                            allowClear
                            style={{ width: 150 }}
                            onChange={setStockFilter}
                            options={[
                                { label: "In Stock", value: "in-stock" },
                                { label: "Low Stock", value: "low-stock" },
                                { label: "Out of Stock", value: "out-of-stock" },
                            ]}
                        />
                    </Space>

                    {selectedRowKeys.length > 0 && (
                        <Space>
                            <span>{selectedRowKeys.length} selected</span>
                            <Button icon={<CheckOutlined />}>Activate</Button>
                            <Button icon={<CloseOutlined />}>Deactivate</Button>
                            <Popconfirm
                                title={`Delete ${selectedRowKeys.length} products?`}
                                onConfirm={handleBulkDelete}
                            >
                                <Button danger icon={<DeleteOutlined />}>Delete</Button>
                            </Popconfirm>
                            <Button onClick={() => setSelectedRowKeys([])}>Clear</Button>
                        </Space>
                    )}
                </Space>

                <Table<Product>
                    rowKey="id"
                    loading={loading}
                    dataSource={products}
                    columns={columns}
                    pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} products` }}
                    scroll={{ x: 1200 }}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                    }}
                />
            </Card>
        </AdminLayout>
    );
}
