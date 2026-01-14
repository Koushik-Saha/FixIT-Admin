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
import {
    PlusOutlined,
    SearchOutlined,
    UploadOutlined,
    DeleteOutlined,
    CheckOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType, TablePaginationConfig } from "antd";

const { Search } = Input;

export default function ProductsPage() {
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // filters
    const [searchText, setSearchText] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [brandFilter, setBrandFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [stockFilter, setStockFilter] = useState<string | null>(null);

    // ✅ pagination state (SERVER SIDE)
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10); // fixed 10 per page
    const [total, setTotal] = useState(0);

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // ✅ reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [searchText, categoryFilter, brandFilter, statusFilter, stockFilter]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {
                page: String(page),
                limit: String(pageSize),
            };

            if (searchText) params.search = searchText;
            if (categoryFilter) params.category = categoryFilter;
            if (brandFilter) params.brand = brandFilter;
            if (statusFilter) params.status = statusFilter;
            if (stockFilter) params.stock = stockFilter;

            // API should return: { data: Product[], pagination: { total, page, limit, totalPages } }
            const res = (await getProducts(params)) as any;

            setProducts(res?.data ?? []);
            setTotal(res?.pagination?.total ?? 0);
        } catch (error) {
            message.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    // ✅ reload when page changes or filters reset page
    useEffect(() => {
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, searchText, categoryFilter, brandFilter, statusFilter, stockFilter]);

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id);
            message.success("Product deleted");
            loadProducts();
        } catch {
            message.error("Failed to delete product");
        }
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedRowKeys.map((id) => deleteProduct(id as string)));
            message.success(`${selectedRowKeys.length} products deleted`);
            setSelectedRowKeys([]);
            loadProducts();
        } catch {
            message.error("Failed to delete products");
        }
    };

    // ⚠️ categories/brands should ideally come from a separate API,
    // because you only have one page of products loaded.
    const categories = [...new Set(products.map((p: any) => p.category).filter(Boolean))];
    const brands = [...new Set(products.map((p: any) => p.brand).filter(Boolean))];

    const columns: TableColumnsType<Product> = [
        {
            title: "Image",
            dataIndex: "images" as any,
            width: 80,
            render: (_: any, record: any) => (record.images && record.images.length > 0  ? <Image src={record.images[0]} width={50} height={50} alt="" /> : "-"),
        },
        { title: "SKU", dataIndex: "sku" as any, width: 120 },
        { title: "Name", dataIndex: "name" as any, width: 200 },
        { title: "Brand", dataIndex: "brand" as any, width: 120 },
        {
            title: "Model",
            dataIndex: "product_models" as any,
            width: 120,
            render: (_: any, record: any) => (
                <Space size="small">
                    <span> {record?.product_models?.name}</span>
                </Space>
            ),
        },
        {
            title: "Category",
            dataIndex: "category" as any,
            width: 120,
            render: (_: any, record: any) => (
                <Space size="small">
                    <span> {record?.categories?.name}</span>
                </Space>
            ),
        },
        {
            title: "Stock",
            dataIndex: "total_stock" as any,
            width: 80,
            render: (stock, record: any) => (
                <span style={{ color: record.low_stock_threshold && stock <= record.low_stock_threshold ? "#ff4d4f" : undefined }}>
          {stock}
        </span>
            ),
        },
        {
            title: "Price",
            dataIndex: "base_price" as any,
            width: 100,
            render: (v) => `$${v}`,
        },
        {
            title: "Cost Price",
            dataIndex: "cost_price" as any,
            width: 100,
            render: (v) => `$${v}`,
        },
        {
            title: "Status",
            dataIndex: "is_active" as any,
            width: 100,
            render: (isActive) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>,
        },
        {
            title: "Actions",
            width: 150,
            fixed: "right",
            render: (_: any, record: any) => (
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
                        <Button size="small" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const onTableChange = (pagination: TablePaginationConfig) => {
        // ✅ update current page (server-side)
        setPage(pagination.current || 1);
    };

    return (
        <AdminLayout>
            <Card
                title="Products"
                extra={
                    <Space>
                        <Button icon={<UploadOutlined />} onClick={() => router.push("/products/bulk-import")}>
                            Bulk Import
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/products/new")}>
                            New Product
                        </Button>
                    </Space>
                }
            >
                <Space orientation="vertical" style={{ width: "100%", marginBottom: 16 }} size="middle">
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
                            options={categories.map((c) => ({ label: c, value: c }))}
                        />
                        <Select
                            placeholder="Brand"
                            allowClear
                            style={{ width: 150 }}
                            onChange={setBrandFilter}
                            options={brands.map((b) => ({ label: b, value: b }))}
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
                            <Popconfirm title={`Delete ${selectedRowKeys.length} products?`} onConfirm={handleBulkDelete}>
                                <Button danger icon={<DeleteOutlined />}>
                                    Delete
                                </Button>
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
                    onChange={onTableChange}
                    pagination={{
                        current: page,
                        pageSize: 10,
                        total, // ✅ real total from backend
                        showSizeChanger: false, // fixed 10 per page
                        showTotal: (t) => `Total ${t} products`,
                    }}
                    scroll={{ x: 1200 }}
                    rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                />
            </Card>
        </AdminLayout>
    );
}
