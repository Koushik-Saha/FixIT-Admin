"use client";

import AdminLayout from "@/components/AdminLayout";
import { fetchWholesaleAccounts } from "@/lib/mockApi";
import type { WholesaleAccount } from "@/lib/types";
import {
    Button,
    Card,
    Space,
    Table,
    Tag,
    Typography,
    Popconfirm,
    message,
} from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

export default function UsersPage() {
    const [accounts, setAccounts] = useState<WholesaleAccount[]>([]);

    useEffect(() => {
        fetchWholesaleAccounts().then(setAccounts);
    }, []);

    const updateStatus = (id: string, status: WholesaleAccount["status"]) => {
        setAccounts((prev) =>
            prev.map((acc) => (acc.id === id ? { ...acc, status } : acc)),
        );
        message.success(`Account ${id} updated to ${status}`);
        // 🔁 Later: call backend: await api.updateWholesaleStatus(id, status)
    };

    const approveAllPending = () => {
        const hasPending = accounts.some((a) => a.status === "pending");
        if (!hasPending) {
            message.info("No pending accounts to approve.");
            return;
        }
        setAccounts((prev) =>
            prev.map((acc) =>
                acc.status === "pending" ? { ...acc, status: "approved" } : acc,
            ),
        );
        message.success("All pending wholesale accounts marked as approved.");
    };

    const pendingCount = accounts.filter((a) => a.status === "pending").length;

    return (
        <AdminLayout>
            <Card
                title="User Management – Wholesale Customers"
                extra={
                    <Space>
                        <Text type="secondary">
                            Pending requests: <b>{pendingCount}</b>
                        </Text>
                        <Popconfirm
                            title="Approve all pending accounts?"
                            description="This will mark every pending wholesale account as approved."
                            onConfirm={approveAllPending}
                            okText="Yes, approve all"
                            cancelText="Cancel"
                            disabled={pendingCount === 0}
                        >
                            <Button type="primary" disabled={pendingCount === 0}>
                                Approve All Pending
                            </Button>
                        </Popconfirm>
                    </Space>
                }
            >
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
                            width: 230,
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
