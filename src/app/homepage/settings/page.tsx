"use client";

import AdminLayout from "@/components/AdminLayout";
import {
    Button,
    Card,
    Input,
    Space,
    Table,
    Tag,
    Switch,
    message,
    Modal,
    Form,
    InputNumber,
} from "antd";
import {
    EditOutlined,
    PlusOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { TableColumnsType } from "antd";

const { TextArea } = Input;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface HomepageSection {
    id: string;
    sectionId: string;
    name: string;
    isActive: boolean;
    sortOrder: number;
    config?: any;
}

export default function HomepageSettingsPage() {
    const [sections, setSections] = useState<HomepageSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
    const [form] = Form.useForm();

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/homepage-sections`);
            const data = await res.json();

            if (data.success) {
                setSections(data.data);
            } else {
                message.error(data.message || "Failed to load sections");
            }
        } catch (error) {
            message.error("Failed to load sections");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const toggleStatus = async (id: string, checked: boolean) => {
        try {
            const res = await fetch(`${API_URL}/admin/homepage-sections/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: checked }),
            });
            const data = await res.json();

            if (data.success) {
                message.success("Section status updated");
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
            const res = await fetch(`${API_URL}/admin/homepage-sections/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                message.success("Section deleted successfully");
                loadData();
            } else {
                message.error(data.message || "Failed to delete section");
            }
        } catch (error) {
            message.error("Failed to delete section");
        }
    };

    const handleSave = async (values: any) => {
        try {
            let configJson = undefined;
            if (values.config) {
                try {
                    configJson = JSON.parse(values.config);
                } catch (e) {
                    message.error("Invalid JSON format in Config field");
                    return;
                }
            }

            const payload = { ...values, config: configJson };

            const method = editingSection ? "PATCH" : "POST";
            const url = editingSection
                ? `${API_URL}/admin/homepage-sections/${editingSection.id}`
                : `${API_URL}/admin/homepage-sections`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                message.success(`Section ${editingSection ? "updated" : "created"} successfully`);
                setIsModalOpen(false);
                loadData();
            } else {
                message.error(data.message || "Operation failed");
            }
        } catch (error) {
            message.error("Operation failed");
        }
    };

    const openModal = (section?: HomepageSection) => {
        setEditingSection(section || null);
        if (section) {
            form.setFieldsValue({
                ...section,
                config: section.config ? JSON.stringify(section.config, null, 2) : "",
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ isActive: true, sortOrder: 0 });
        }
        setIsModalOpen(true);
    };

    const columns: TableColumnsType<HomepageSection> = [
        { title: "Sort Order", dataIndex: "sortOrder", width: 100, sorter: (a, b) => a.sortOrder - b.sortOrder },
        { title: "Internal ID", dataIndex: "sectionId", width: 180 },
        { title: "Display Name", dataIndex: "name", width: 200 },
        {
            title: "Visibility",
            dataIndex: "isActive",
            width: 150,
            render: (isActive, record) => (
                <Space>
                    <Switch
                        checked={isActive}
                        onChange={(checked) => toggleStatus(record.id, checked)}
                    />
                    <Tag color={isActive ? "green" : "red"}>{isActive ? "Visible" : "Hidden"}</Tag>
                </Space>
            ),
        },
        {
            title: "Actions",
            width: 150,
            fixed: "right",
            render: (_: any, record: HomepageSection) => (
                <Space size="small">
                    <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Card
                title="Homepage Layout Settings"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                        Add Section
                    </Button>
                }
            >
                <Table<HomepageSection>
                    rowKey="id"
                    loading={loading}
                    dataSource={sections}
                    columns={columns}
                    pagination={false}
                />
            </Card>

            <Modal
                title={editingSection ? "Edit Section" : "Add Section"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form layout="vertical" form={form} onFinish={handleSave}>
                    <Form.Item
                        name="sectionId"
                        label="Section Internal ID"
                        rules={[{ required: true }]}
                        help="Must exactly match the ID expected by the frontend code (e.g., 'flash_deals', 'top_brands')"
                    >
                        <Input disabled={!!editingSection} />
                    </Form.Item>

                    <Form.Item name="name" label="Display Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="sortOrder" label="Sort Order">
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item name="isActive" label="Visibility" valuePropName="checked">
                            <Switch checkedChildren="Visible" unCheckedChildren="Hidden" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="config"
                        label="Extra Configuration (JSON format)"
                        help="E.g. {&quot;endDate&quot;: &quot;2026-10-31T23:59:59Z&quot;} for Countdown Timers"
                    >
                        <TextArea rows={4} placeholder="{}" />
                    </Form.Item>

                    <Form.Item className="mb-0 flex justify-end">
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                {editingSection ? "Update" : "Create"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}
