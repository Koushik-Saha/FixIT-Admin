// src/app/repairs/page.tsx
"use client";

import AdminLayout from "@/components/AdminLayout";
import { fetchRepairs } from "@/lib/mockApi";
import type { RepairTicket } from "@/lib/types";
import { Card, Table, Tag, Select } from "antd";
import { useEffect, useMemo, useState } from "react";

export default function RepairsPage() {
    const [repairs, setRepairs] = useState<RepairTicket[]>([]);
    const [statusFilter, setStatusFilter] = useState<string | undefined>();

    useEffect(() => {
        fetchRepairs().then(setRepairs);
    }, []);

    const filtered = useMemo(
        () =>
            repairs.filter((r) =>
                statusFilter ? r.status === statusFilter : true,
            ),
        [repairs, statusFilter],
    );

    return (
        <AdminLayout>
            <Card
                title="Repair Ticket Management"
                extra={
                    <Select
                        allowClear
                        placeholder="Filter by status"
                        style={{ width: 200 }}
                        value={statusFilter}
                        onChange={(v) => setStatusFilter(v)}
                        options={[
                            { value: "new", label: "New" },
                            { value: "in_progress", label: "In Progress" },
                            { value: "completed", label: "Completed" },
                            { value: "cancelled", label: "Cancelled" },
                        ]}
                    />
                }
            >
                <Table<RepairTicket>
                    rowKey="id"
                    dataSource={filtered}
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    columns={[
                        { title: "Ticket", dataIndex: "id", width: 110 },
                        { title: "Customer", dataIndex: "customerName" },
                        { title: "Device", dataIndex: "device" },
                        { title: "Issue", dataIndex: "issue" },
                        {
                            title: "Status",
                            dataIndex: "status",
                            width: 140,
                            render: (status) => (
                                <Tag
                                    color={
                                        status === "new"
                                            ? "blue"
                                            : status === "in_progress"
                                                ? "gold"
                                                : status === "completed"
                                                    ? "green"
                                                    : "red"
                                    }
                                >
                                    {status.replace("_", " ").toUpperCase()}
                                </Tag>
                            ),
                        },
                        {
                            title: "Created",
                            dataIndex: "createdAt",
                            width: 200,
                            render: (v) => new Date(v).toLocaleString(),
                        },
                    ]}
                />
            </Card>
        </AdminLayout>
    );
}
