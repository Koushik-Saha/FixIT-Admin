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
    Popconfirm,
} from "antd";
import {
    SearchOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { TableColumnsType } from "antd";

const { Search } = Input;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface Subscriber {
    id: string;
    email: string;
    isActive: boolean;
    createdAt: string;
}

export default function NewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/newsletter`);
            const data = await res.json();

            if (data.success) {
                setSubscribers(data.data);
            } else {
                message.error(data.message || "Failed to load subscribers");
            }
        } catch (error) {
            message.error("Failed to load subscribers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const toggleStatus = async (id: string, checked: boolean) => {
        try {
            const res = await fetch(`${API_URL}/admin/newsletter/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: checked }),
            });
            const data = await res.json();

            if (data.success) {
                message.success("Subscriber status updated");
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
            const res = await fetch(`${API_URL}/admin/newsletter/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                message.success("Subscriber deleted successfully");
                loadData();
            } else {
                message.error(data.message || "Failed to delete subscriber");
            }
        } catch (error) {
            message.error("Failed to delete subscriber");
        }
    };

    const columns: TableColumnsType<Subscriber> = [
        { title: "Email", dataIndex: "email", width: 300 },
        {
            title: "Subscribed Date",
            dataIndex: "createdAt",
            width: 200,
            render: (date) => new Date(date).toLocaleString()
        },
        {
            title: "Status",
            dataIndex: "isActive",
            width: 150,
            render: (isActive, record) => (
                <Space>
                    <Switch
                        checked={isActive}
                        onChange={(checked) => toggleStatus(record.id, checked)}
                    />
                    <Tag color={isActive ? "green" : "red"}>{isActive ? "Subscribed" : "Unsubscribed"}</Tag>
                </Space>
            ),
        },
        {
            title: "Actions",
            width: 100,
            fixed: "right",
            render: (_: any, record: Subscriber) => (
                <Popconfirm
                    title="Delete this subscriber?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    const filteredSubscribers = subscribers.filter(
        (s) => s.email.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <AdminLayout>
            <Card title="Newsletter Subscribers">
                <Space style={{ marginBottom: 16 }}>
                    <Search
                        placeholder="Search by email"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchText}
                        style={{ width: 350 }}
                    />
                </Space>

                <Table<Subscriber>
                    rowKey="id"
                    loading={loading}
                    dataSource={filteredSubscribers}
                    columns={columns}
                    scroll={{ x: 800 }}
                />
            </Card>
        </AdminLayout>
    );
}
