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

interface NavigationItem {
    id: string;
    title: string;
    url: string;
    parentId?: string | null;
    parent?: { id: string; title: string };
    type: string;
    categoryId?: string | null;
    icon?: string;
    sortOrder: number;
    isActive: boolean;
}

export default function NavigationPage() {
    const [navItems, setNavItems] = useState<NavigationItem[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
    const [form] = Form.useForm();

    const loadData = async () => {
        setLoading(true);
        try {
            const [navRes, catsRes] = await Promise.all([
                fetch(`${API_URL}/admin/navigation-items`),
                fetch(`${API_URL}/admin/categories`),
            ]);

            const [navData, catsData] = await Promise.all([
                navRes.json(),
                catsRes.json(),
            ]);

            if (navData.success) setNavItems(navData.data);
            if (catsData.success) setCategories(catsData.data);
        } catch (error) {
            message.error("Failed to load navigation data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async (values: any) => {
        try {
            const method = editingItem ? "PATCH" : "POST";
            const url = editingItem
                ? `${API_URL}/admin/navigation-items/${editingItem.id}`
                : `${API_URL}/admin/navigation-items`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (data.success) {
                message.success(`Navigation item ${editingItem ? "updated" : "created"} successfully`);
                setIsModalOpen(false);
                loadData();
            } else {
                message.error(data.message || "Operation failed");
            }
        } catch (error) {
            message.error("Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/admin/navigation-items/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                message.success("Navigation item deleted successfully");
                loadData();
            } else {
                message.error(data.message || "Failed to delete navigation item");
            }
        } catch (error) {
            message.error("Failed to delete navigation item");
        }
    };

    const openModal = (item?: NavigationItem) => {
        setEditingItem(item || null);
        if (item) {
            form.setFieldsValue(item);
        } else {
            form.resetFields();
            form.setFieldsValue({ isActive: true, sortOrder: 0, type: "link" });
        }
        setIsModalOpen(true);
    };

    const columns: TableColumnsType<NavigationItem> = [
        { title: "Title", dataIndex: "title", width: 200 },
        { title: "URL", dataIndex: "url", width: 200 },
        {
            title: "Parent",
            key: "parent",
            width: 150,
            render: (_: any, record: NavigationItem) => record.parent?.title || "-",
        },
        {
            title: "Type",
            dataIndex: "type",
            width: 120,
            render: (type) => <Tag color="blue">{type.toUpperCase()}</Tag>,
        },
        {
            title: "Status",
            dataIndex: "isActive",
            width: 100,
            render: (isActive) => (
                <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>
            ),
        },
        { title: "Sort Order", dataIndex: "sortOrder", width: 100 },
        {
            title: "Actions",
            width: 150,
            fixed: "right",
            render: (_: any, record: NavigationItem) => (
                <Space size="small">
                    <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)} />
                    <Popconfirm
                        title="Delete this navigation item?"
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

    const filteredItems = navItems.filter(
        (i) =>
            i.title.toLowerCase().includes(searchText.toLowerCase()) ||
            i.url.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <AdminLayout>
            <Card
                title="Navigation Mega Menu Builder"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                        New Navigation Item
                    </Button>
                }
            >
                <Space style={{ marginBottom: 16 }}>
                    <Search
                        placeholder="Search items by title or URL"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchText}
                        style={{ width: 350 }}
                    />
                </Space>

                <Table<NavigationItem>
                    rowKey="id"
                    loading={loading}
                    dataSource={filteredItems}
                    columns={columns}
                    scroll={{ x: 1000 }}
                />
            </Card>

            <Modal
                title={editingItem ? "Edit Navigation Item" : "New Navigation Item"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnHidden
            >
                <Form layout="vertical" form={form} onFinish={handleSave}>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                            <Input placeholder="e.g. Shop All Phones" />
                        </Form.Item>
                        <Form.Item name="url" label="URL Path" rules={[{ required: true }]}>
                            <Input placeholder="e.g. /shop/phones" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="type" label="Menu Link Type" rules={[{ required: true }]}>
                            <Select
                                options={[
                                    { label: "Standard Link", value: "link" },
                                    { label: "Category Dropdown", value: "category" },
                                    { label: "Mega Menu Panel", value: "mega" },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item name="parentId" label="Parent Menu Item">
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                placeholder="Select parent item (optional)"
                                options={navItems
                                    .filter((i) => i.id !== editingItem?.id)
                                    .map((i) => ({ label: i.title, value: i.id }))}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item name="categoryId" label="Bind to Category (Optional)">
                        <Select
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            placeholder="Select category to link"
                            options={categories.map((c) => ({ label: c.name, value: c.id }))}
                        />
                    </Form.Item>

                    <Form.Item name="icon" label="Icon Name/URL (Optional)">
                        <Input />
                    </Form.Item>

                    <div className="flex gap-4">
                        <Form.Item name="isActive" label="Active" valuePropName="checked">
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
                                {editingItem ? "Update Item" : "Create Item"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}
