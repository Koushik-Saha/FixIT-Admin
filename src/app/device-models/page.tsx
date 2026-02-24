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

interface DeviceModel {
    id: string;
    name: string;
    slug: string;
    categoryId?: string;
    categoryName?: string;
    brandId?: string;
    brandName?: string;
    isNew: boolean;
    isActive: boolean;
    sortOrder: number;
}

export default function DeviceModelsPage() {
    const [models, setModels] = useState<DeviceModel[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingModel, setEditingModel] = useState<DeviceModel | null>(null);
    const [form] = Form.useForm();

    const loadData = async () => {
        setLoading(true);
        try {
            const [modelsRes, catsRes, brandsRes] = await Promise.all([
                fetch(`${API_URL}/admin/device-models`),
                fetch(`${API_URL}/admin/categories`),
                fetch(`${API_URL}/admin/brands`),
            ]);

            const [modelsData, catsData, brandsData] = await Promise.all([
                modelsRes.json(),
                catsRes.json(),
                brandsRes.json(),
            ]);

            if (modelsData.success) setModels(modelsData.data);
            if (catsData.success) setCategories(catsData.data);
            if (brandsData.success) setBrands(brandsData.data);

        } catch (error) {
            message.error("Failed to load device models data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async (values: any) => {
        try {
            const method = editingModel ? "PATCH" : "POST";
            const url = editingModel
                ? `${API_URL}/admin/device-models/${editingModel.id}`
                : `${API_URL}/admin/device-models`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (data.success) {
                message.success(`Model ${editingModel ? "updated" : "created"} successfully`);
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
            const res = await fetch(`${API_URL}/admin/device-models/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                message.success("Model deleted successfully");
                loadData();
            } else {
                message.error(data.message || "Failed to delete model");
            }
        } catch (error) {
            message.error("Failed to delete model");
        }
    };

    const openModal = (model?: DeviceModel) => {
        setEditingModel(model || null);
        if (model) {
            form.setFieldsValue(model);
        } else {
            form.resetFields();
            form.setFieldsValue({ isActive: true, isNew: false, sortOrder: 0 });
        }
        setIsModalOpen(true);
    };

    const columns: TableColumnsType<DeviceModel> = [
        { title: "Name", dataIndex: "name", width: 200 },
        { title: "Slug", dataIndex: "slug", width: 200 },
        {
            title: "Category",
            dataIndex: "categoryName",
            width: 150,
            render: (name) => name || "-"
        },
        {
            title: "Brand",
            dataIndex: "brandName",
            width: 150,
            render: (name) => name || "-"
        },
        {
            title: "New",
            dataIndex: "isNew",
            width: 100,
            render: (val) => <Tag color={val ? "blue" : "default"}>{val ? "Yes" : "No"}</Tag>,
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
            render: (_: any, record: DeviceModel) => (
                <Space size="small">
                    <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)} />
                    <Popconfirm
                        title="Delete model?"
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

    const filteredModels = models.filter((m) =>
        m.name.toLowerCase().includes(searchText.toLowerCase()) ||
        m.slug.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <AdminLayout>
            <Card
                title="Device Models Management"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                        New Model
                    </Button>
                }
            >
                <Space style={{ marginBottom: 16 }}>
                    <Search
                        placeholder="Search models"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchText}
                        style={{ width: 300 }}
                    />
                </Space>

                <Table<DeviceModel>
                    rowKey="id"
                    loading={loading}
                    dataSource={filteredModels}
                    columns={columns}
                    scroll={{ x: 1000 }}
                />
            </Card>

            <Modal
                title={editingModel ? "Edit Device Model" : "New Device Model"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form layout="vertical" form={form} onFinish={handleSave}>
                    <Form.Item name="name" label="Model Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="slug" label="Slug (URL friendly)" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <div className="flex gap-4">
                        <Form.Item name="categoryId" label="Category" className="flex-1">
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                placeholder="Select category"
                                options={categories.map((c) => ({ label: c.name, value: c.id }))}
                            />
                        </Form.Item>
                        <Form.Item name="brandId" label="Brand" className="flex-1">
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                placeholder="Select brand"
                                options={brands.map((b) => ({ label: b.name, value: b.id }))}
                            />
                        </Form.Item>
                    </div>

                    <div className="flex gap-4">
                        <Form.Item name="isActive" label="Active" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item name="isNew" label="New Model Tag" valuePropName="checked">
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
