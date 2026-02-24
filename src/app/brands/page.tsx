"use client";

import AdminLayout from "@/components/AdminLayout";
import {
    Button,
    Card,
    Input,
    Space,
    Table,
    Tag,
    Modal,
    Form,
    Switch,
    Select,
    InputNumber,
    message,
    Popconfirm,
    Upload,
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { TableColumnsType } from "antd";
import type { UploadFile, UploadProps } from "antd";

const { Search } = Input;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface Brand {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    type: string;
    isPopular: boolean;
    isActive: boolean;
    sortOrder: number;
}

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const loadBrands = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/brands`);
            const data = await res.json();
            if (data.success) {
                setBrands(data.data);
            } else {
                message.error(data.message || "Failed to load brands");
            }
        } catch (error) {
            message.error("Failed to load brands");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBrands();
    }, []);

    const handleSave = async (values: any) => {
        try {
            const method = editingBrand ? "PATCH" : "POST";
            const url = editingBrand
                ? `${API_URL}/admin/brands/${editingBrand.id}`
                : `${API_URL}/admin/brands`;

            // Handle logo upload separately in a real app (e.g., Supabase storage)
            // For now, assume logo URL is typed manually or handled simply
            const payload = { ...values };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                message.success(`Brand ${editingBrand ? "updated" : "created"} successfully`);
                setIsModalOpen(false);
                loadBrands();
            } else {
                message.error(data.message || "Operation failed");
            }
        } catch (error) {
            message.error("Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/admin/brands/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                message.success("Brand deleted successfully");
                loadBrands();
            } else {
                message.error(data.message || "Failed to delete brand");
            }
        } catch (error) {
            message.error("Failed to delete brand");
        }
    };

    const openModal = (brand?: Brand) => {
        setEditingBrand(brand || null);
        if (brand) {
            form.setFieldsValue(brand);
            // setFileList if logo exists
        } else {
            form.resetFields();
            form.setFieldsValue({ isActive: true, isPopular: false, sortOrder: 0, type: "phone" });
        }
        setIsModalOpen(true);
    };

    const columns: TableColumnsType<Brand> = [
        {
            title: "Logo",
            dataIndex: "logo",
            width: 80,
            render: (logo) => (logo ? <img src={logo} alt="logo" style={{ width: 40, height: 40, objectFit: "contain" }} /> : "-"),
        },
        { title: "Name", dataIndex: "name", width: 200 },
        { title: "Slug", dataIndex: "slug", width: 200 },
        {
            title: "Type",
            dataIndex: "type",
            width: 120,
            render: (type) => <Tag color="blue">{type.toUpperCase()}</Tag>
        },
        {
            title: "Popular",
            dataIndex: "isPopular",
            width: 100,
            render: (val) => <Tag color={val ? "gold" : "default"}>{val ? "Yes" : "No"}</Tag>,
        },
        {
            title: "Status",
            dataIndex: "isActive",
            width: 100,
            render: (isActive) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>,
        },
        { title: "Sort Order", dataIndex: "sortOrder", width: 100 },
        {
            title: "Actions",
            width: 150,
            fixed: "right",
            render: (_: any, record: Brand) => (
                <Space size="small">
                    <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)} />
                    <Popconfirm
                        title="Delete brand?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const filteredBrands = brands.filter((b) =>
        b.name.toLowerCase().includes(searchText.toLowerCase()) ||
        b.slug.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <AdminLayout>
            <Card
                title="Brands Management"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                        New Brand
                    </Button>
                }
            >
                <Space style={{ marginBottom: 16 }}>
                    <Search
                        placeholder="Search brands"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchText}
                        style={{ width: 300 }}
                    />
                </Space>

                <Table<Brand>
                    rowKey="id"
                    loading={loading}
                    dataSource={filteredBrands}
                    columns={columns}
                    scroll={{ x: 1000 }}
                />
            </Card>

            <Modal
                title={editingBrand ? "Edit Brand" : "New Brand"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form layout="vertical" form={form} onFinish={handleSave}>
                    <Form.Item name="name" label="Brand Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="slug" label="Slug (URL friendly)" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Device Type" rules={[{ required: true }]}>
                        <Select options={[
                            { label: "Phone", value: "phone" },
                            { label: "Tablet", value: "tablet" },
                            { label: "Laptop", value: "laptop" },
                            { label: "Watch", value: "watch" },
                            { label: "Gaming", value: "gaming" },
                            { label: "Other", value: "other" },
                        ]} />
                    </Form.Item>
                    <Form.Item name="logo" label="Logo URL (Optional)">
                        <Input placeholder="https://example.com/logo.png" />
                    </Form.Item>
                    <div className="flex gap-4">
                        <Form.Item name="isActive" label="Active" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item name="isPopular" label="Popular (Featured)" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item name="sortOrder" label="Sort Order">
                            <InputNumber min={0} />
                        </Form.Item>
                    </div>
                    <Form.Item className="mb-0 flex justify-end">
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}
