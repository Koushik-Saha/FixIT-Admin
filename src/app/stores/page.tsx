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

const { Search, TextArea } = Input;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface StoreLocation {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone?: string;
    email?: string;
    hours?: string;
    latitude?: number;
    longitude?: number;
    isActive: boolean;
}

export default function StoresPage() {
    const [stores, setStores] = useState<StoreLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStore, setEditingStore] = useState<StoreLocation | null>(null);
    const [form] = Form.useForm();

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/stores`);
            const data = await res.json();

            if (data.success) {
                setStores(data.data);
            } else {
                message.error(data.message || "Failed to load store locations");
            }
        } catch (error) {
            message.error("Failed to load store locations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async (values: any) => {
        try {
            const method = editingStore ? "PATCH" : "POST";
            const url = editingStore
                ? `${API_URL}/admin/stores/${editingStore.id}`
                : `${API_URL}/admin/stores`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (data.success) {
                message.success(`Store location ${editingStore ? "updated" : "created"} successfully`);
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
            const res = await fetch(`${API_URL}/admin/stores/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                message.success("Store location deleted successfully");
                loadData();
            } else {
                message.error(data.message || "Failed to delete store location");
            }
        } catch (error) {
            message.error("Failed to delete store location");
        }
    };

    const openModal = (store?: StoreLocation) => {
        setEditingStore(store || null);
        if (store) {
            form.setFieldsValue({
                ...store,
                latitude: store.latitude?.toString(),
                longitude: store.longitude?.toString()
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ isActive: true });
        }
        setIsModalOpen(true);
    };

    const columns: TableColumnsType<StoreLocation> = [
        { title: "Name", dataIndex: "name", width: 180 },
        { title: "Address", dataIndex: "address", width: 200, ellipsis: true },
        { title: "City", dataIndex: "city", width: 120 },
        { title: "State", dataIndex: "state", width: 80 },
        { title: "Phone", dataIndex: "phone", width: 150 },
        {
            title: "Status",
            dataIndex: "isActive",
            width: 100,
            render: (isActive) => (
                <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>
            ),
        },
        {
            title: "Actions",
            width: 150,
            fixed: "right",
            render: (_: any, record: StoreLocation) => (
                <Space size="small">
                    <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)} />
                    <Popconfirm
                        title="Delete store location?"
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

    const filteredStores = stores.filter(
        (s) =>
            s.name.toLowerCase().includes(searchText.toLowerCase()) ||
            s.city.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <AdminLayout>
            <Card
                title="Store Locations Management"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                        New Location
                    </Button>
                }
            >
                <Space style={{ marginBottom: 16 }}>
                    <Search
                        placeholder="Search by name or city"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchText}
                        style={{ width: 350 }}
                    />
                </Space>

                <Table<StoreLocation>
                    rowKey="id"
                    loading={loading}
                    dataSource={filteredStores}
                    columns={columns}
                    scroll={{ x: 1000 }}
                />
            </Card>

            <Modal
                title={editingStore ? "Edit Store Location" : "New Store Location"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                <Form layout="vertical" form={form} onFinish={handleSave}>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="name" label="Store Name" rules={[{ required: true }]}>
                            <Input placeholder="e.g. FixItUp LA" />
                        </Form.Item>
                        <Form.Item name="phone" label="Phone Number">
                            <Input placeholder="(818) 402-4931" />
                        </Form.Item>
                    </div>

                    <Form.Item name="address" label="Street Address" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item name="city" label="City" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="state" label="State" rules={[{ required: true }]}>
                            <Input placeholder="CA" />
                        </Form.Item>
                        <Form.Item name="zip" label="Zip Code" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="email" label="Contact Email">
                            <Input />
                        </Form.Item>
                        <Form.Item name="isActive" label="Physical Status" valuePropName="checked">
                            <Switch checkedChildren="Open" unCheckedChildren="Closed" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="latitude" label="Map Latitude (Optional)">
                            <Input placeholder="34.0522" />
                        </Form.Item>
                        <Form.Item name="longitude" label="Map Longitude (Optional)">
                            <Input placeholder="-118.2437" />
                        </Form.Item>
                    </div>

                    <Form.Item name="hours" label="Operating Hours (Plain Text or JSON)">
                        <TextArea rows={3} placeholder="Mon-Fri: 9AM - 6PM, Sat: 10AM - 4PM, Sun: Closed" />
                    </Form.Item>


                    <Form.Item className="mb-0 flex justify-end">
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                {editingStore ? "Update Location" : "Create Location"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}
