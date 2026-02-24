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
const { TextArea } = Input;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface Page {
    id: string;
    title: string;
    slug: string;
    content: string;
    metaTitle?: string;
    metaDescription?: string;
    isPublished: boolean;
    createdAt: string;
}

export default function PagesManagement() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [form] = Form.useForm();

    const loadPages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/pages`);
            const data = await res.json();
            if (data.success) {
                setPages(data.data);
            } else {
                message.error(data.message || "Failed to load pages");
            }
        } catch (error) {
            message.error("Failed to load pages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPages();
    }, []);

    const handleSave = async (values: any) => {
        try {
            const method = editingPage ? "PATCH" : "POST";
            const url = editingPage
                ? `${API_URL}/admin/pages/${editingPage.id}`
                : `${API_URL}/admin/pages`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (data.success) {
                message.success(`Page ${editingPage ? "updated" : "created"} successfully`);
                setIsModalOpen(false);
                loadPages();
            } else {
                message.error(data.message || "Operation failed");
            }
        } catch (error) {
            message.error("Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/admin/pages/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                message.success("Page deleted successfully");
                loadPages();
            } else {
                message.error(data.message || "Failed to delete page");
            }
        } catch (error) {
            message.error("Failed to delete page");
        }
    };

    const openModal = (page?: Page) => {
        setEditingPage(page || null);
        if (page) {
            form.setFieldsValue(page);
        } else {
            form.resetFields();
            form.setFieldsValue({ isPublished: false });
        }
        setIsModalOpen(true);
    };

    const columns: TableColumnsType<Page> = [
        { title: "Title", dataIndex: "title", width: 200 },
        { title: "Slug", dataIndex: "slug", width: 200 },
        {
            title: "Status",
            dataIndex: "isPublished",
            width: 120,
            render: (isPublished) => (
                <Tag color={isPublished ? "green" : "default"}>
                    {isPublished ? "Published" : "Draft"}
                </Tag>
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            width: 150,
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: "Actions",
            width: 150,
            fixed: "right",
            render: (_: any, record: Page) => (
                <Space size="small">
                    <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)} />
                    <Popconfirm
                        title="Are you sure you want to delete this page?"
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

    const filteredPages = pages.filter((p) =>
        p.title.toLowerCase().includes(searchText.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <AdminLayout>
            <Card
                title="Static Pages CMS"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                        Create Page
                    </Button>
                }
            >
                <Space style={{ marginBottom: 16 }}>
                    <Search
                        placeholder="Search pages by title or slug"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchText}
                        style={{ width: 350 }}
                    />
                </Space>

                <Table<Page>
                    rowKey="id"
                    loading={loading}
                    dataSource={filteredPages}
                    columns={columns}
                    scroll={{ x: 1000 }}
                />
            </Card>

            <Modal
                title={editingPage ? "Edit CMS Page" : "New CMS Page"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form layout="vertical" form={form} onFinish={handleSave}>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="title" label="Page Title" rules={[{ required: true }]}>
                            <Input placeholder="e.g. Terms & Conditions" />
                        </Form.Item>
                        <Form.Item name="slug" label="URL Slug" rules={[{ required: true }]}>
                            <Input placeholder="e.g. terms-and-conditions" />
                        </Form.Item>
                    </div>

                    <Form.Item name="content" label="HTML Content" rules={[{ required: true }]}>
                        <TextArea
                            rows={10}
                            placeholder="<h1>Heading</h1><p>Main content goes here...</p>"
                            className="font-mono text-sm"
                        />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="metaTitle" label="SEO Meta Title (Optional)">
                            <Input />
                        </Form.Item>
                        <Form.Item name="metaDescription" label="SEO Meta Description (Optional)">
                            <Input />
                        </Form.Item>
                    </div>

                    <Form.Item name="isPublished" label="Publish Status" valuePropName="checked">
                        <Switch checkedChildren="Published" unCheckedChildren="Draft" />
                    </Form.Item>

                    <Form.Item className="mb-0 flex justify-end">
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                {editingPage ? "Update Page" : "Create Page"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}
