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
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { TableColumnsType } from "antd";

const { Search } = Input;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface Category {
    id: string;
    name: string;
    slug: string;
    icon?: string;
    description?: string;
    isActive: boolean;
    sort_order: number;
    parent?: Category | null;
    parentId?: string | null;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [form] = Form.useForm();

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/categories`);
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            } else {
                message.error(data.message || "Failed to load categories");
            }
        } catch (error) {
            message.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleSave = async (values: any) => {
        try {
            const method = editingCategory ? "PATCH" : "POST";
            const url = editingCategory
                ? `${API_URL}/admin/categories/${editingCategory.id}`
                : `${API_URL}/admin/categories`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (data.success) {
                message.success(`Category ${editingCategory ? "updated" : "created"} successfully`);
                setIsModalOpen(false);
                loadCategories();
            } else {
                message.error(data.message || "Operation failed");
            }
        } catch (error) {
            message.error("Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/admin/categories/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                message.success("Category deleted successfully");
                loadCategories();
            } else {
                message.error(data.message || "Failed to delete category");
            }
        } catch (error) {
            message.error("Failed to delete category");
        }
    };

    const openModal = (category?: Category) => {
        setEditingCategory(category || null);
        if (category) {
            form.setFieldsValue(category);
        } else {
            form.resetFields();
            form.setFieldsValue({ isActive: true, sort_order: 0 });
        }
        setIsModalOpen(true);
    };

    const columns: TableColumnsType<Category> = [
        {
            title: "Icon",
            dataIndex: "icon",
            width: 80,
            render: (icon) => (icon ? <img src={icon} alt="icon" style={{ width: 30, height: 30 }} /> : "-"),
        },
        { title: "Name", dataIndex: "name", width: 200 },
        { title: "Slug", dataIndex: "slug", width: 200 },
        {
            title: "Parent",
            key: "parent",
            width: 200,
            render: (_: any, record: Category) => record.parent?.name || "-"
        },
        {
            title: "Status",
            dataIndex: "isActive",
            width: 100,
            render: (isActive) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>,
        },
        { title: "Sort Order", dataIndex: "sort_order", width: 100 },
        {
            title: "Actions",
            width: 150,
            fixed: "right",
            render: (_: any, record: Category) => (
                <Space size="small">
                    <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)} />
                    <Popconfirm
                        title="Delete category?"
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

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <AdminLayout>
            <Card
                title="Categories Management"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                        New Category
                    </Button>
                }
            >
                <Space style={{ marginBottom: 16 }}>
                    <Search
                        placeholder="Search categories"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchText}
                        style={{ width: 300 }}
                    />
                </Space>

                <Table<Category>
                    rowKey="id"
                    loading={loading}
                    dataSource={filteredCategories}
                    columns={columns}
                    scroll={{ x: 1000 }}
                />
            </Card>

            <Modal
                title={editingCategory ? "Edit Category" : "New Category"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form layout="vertical" form={form} onFinish={handleSave}>
                    <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="slug" label="Slug (URL friendly)" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="parentId" label="Parent Category">
                        <Select
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            placeholder="Select parent category (optional)"
                            options={categories
                                .filter(c => c.id !== editingCategory?.id)
                                .map((c) => ({ label: c.name, value: c.id }))}
                        />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="icon" label="Icon URL (Optional)">
                        <Input placeholder="https://example.com/icon.png" />
                    </Form.Item>

                    <div className="flex gap-4">
                        <Form.Item name="isActive" label="Active" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item name="sort_order" label="Sort Order">
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
