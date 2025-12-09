// src/app/wholesale/page.tsx
"use client";

import AdminLayout from "@/components/AdminLayout";
import { fetchWholesaleAccounts } from "@/lib/mockApi";
import type { WholesaleAccount } from "@/lib/types";
import { Button, Card, Table, Tag, Space, message } from "antd";
import { useEffect, useState } from "react";

export default function WholesalePage() {
    const [accounts, setAccounts] = useState<WholesaleAccount[]>([]);

    useEffect(() => {
        fetchWholesaleAccounts().then(setAccounts);
    }, []);

    const updateStatus = (id: string, status: WholesaleAccount["status"]) => {
        setAccounts((prev) =>
            prev.map((acc) => (acc.id === id ? { ...acc, status } : acc)),
        );
        message.success(`Account ${id} marked as ${status}`);
    };

    return (
        <AdminLayout>
            <Card title="Wholesale Accounts">
                <Table<WholesaleAccount>
                    rowKey="id"
                    dataSource={accounts}
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    columns={[
                        { title: "ID", dataIndex: "id", width: 90 },
                        { title: "Business", dataIndex: "businessName" },
                        { title: "Contact", dataIndex: "contactName" },
                        { title: "Email", dataIndex: "email" },
                        {
                            title: "Tier",
                            dataIndex: "tier",
                            width: 120,
                            render: (tier) => <Tag color="blue">{tier}</Tag>,
                        },
                        {
                            title: "Status",
                            dataIndex: "status",
                            width: 120,
                            render: (status) => (
                                <Tag
                                    color={
                                        status === "approved"
                                            ? "green"
                                            : status === "pending"
                                                ? "gold"
                                                : "red"
                                    }
                                >
                                    {status.toUpperCase()}
                                </Tag>
                            ),
                        },
                        {
                            title: "Actions",
                            width: 220,
                            render: (_, record) => (
                                <Space>
                                    <Button
                                        size="small"
                                        type="primary"
                                        disabled={record.status === "approved"}
                                        onClick={() => updateStatus(record.id, "approved")}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        size="small"
                                        danger
                                        disabled={record.status === "rejected"}
                                        onClick={() => updateStatus(record.id, "rejected")}
                                    >
                                        Reject
                                    </Button>
                                </Space>
                            ),
                        },
                    ]}
                />
            </Card>
        </AdminLayout>
    );
}
