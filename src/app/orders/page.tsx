// src/app/orders/page.tsx
"use client";

import AdminLayout from "@/components/AdminLayout";
import { fetchOrders } from "@/lib/mockApi";
import type { Order } from "@/lib/types";
import { Card, Table, Tag, Input, Space } from "antd";
import { useEffect, useMemo, useState } from "react";

const { Search } = Input;

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchOrders().then(setOrders);
    }, []);

    const filtered = useMemo(
        () =>
            orders.filter((o) =>
                (o.id + o.customerName + o.status)
                    .toLowerCase()
                    .includes(search.toLowerCase()),
            ),
        [orders, search],
    );

    return (
        <AdminLayout>
            <Card
                title="Order Management"
                extra={
                    <Space>
                        <Search
                            placeholder="Search orders or customers"
                            allowClear
                            onSearch={setSearch}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: 260 }}
                            size="middle"
                        />
                    </Space>
                }
            >
                <Table<Order>
                    rowKey="id"
                    dataSource={filtered}
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    columns={[
                        { title: "Order ID", dataIndex: "id", width: 120 },
                        { title: "Customer", dataIndex: "customerName" },
                        {
                            title: "Total",
                            dataIndex: "total",
                            width: 110,
                            render: (v) => `$${v.toFixed(2)}`,
                        },
                        {
                            title: "Status",
                            dataIndex: "status",
                            width: 120,
                            filters: [
                                { text: "Pending", value: "pending" },
                                { text: "Paid", value: "paid" },
                                { text: "Shipped", value: "shipped" },
                                { text: "Cancelled", value: "cancelled" },
                            ],
                            onFilter: (value, record) => record.status === value,
                            render: (status) => (
                                <Tag
                                    color={
                                        status === "paid"
                                            ? "green"
                                            : status === "pending"
                                                ? "gold"
                                                : status === "shipped"
                                                    ? "blue"
                                                    : "red"
                                    }
                                >
                                    {status.toUpperCase()}
                                </Tag>
                            ),
                        },
                        {
                            title: "Created At",
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
