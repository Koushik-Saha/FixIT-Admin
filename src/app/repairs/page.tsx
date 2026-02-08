"use client";

import AdminLayout from "@/components/AdminLayout";
import { getRepairs } from "@/lib/api";
import type { RepairTicket } from "@/lib/types";
import {
    Card,
    Table,
    Tag,
    Input,
    Space,
    Select,
    Button,
    message,
} from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";

const { Search } = Input;

export default function RepairsPage() {
    const router = useRouter();
    const [repairs, setRepairs] = useState<RepairTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
    const [storeFilter, setStoreFilter] = useState<string | null>(null);

    const loadRepairs = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (searchText) params.search = searchText;
            if (statusFilter) params.status = statusFilter;
            if (priorityFilter) params.priority = priorityFilter;
            if (storeFilter) params.store = storeFilter;

            const data = await getRepairs(params) as RepairTicket[];
            setRepairs(data);
        } catch (error) {
            message.error("Failed to load repair tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRepairs();
    }, [searchText, statusFilter, priorityFilter, storeFilter]);

    const columns: TableColumnsType<RepairTicket> = [
        {
            title: "Ticket#",
            dataIndex: "ticketNumber",
            width: 140,
        },
        {
            title: "Customer",
            dataIndex: "customerName",
            width: 180,
        },
        {
            title: "Device",
            width: 200,
            render: (_, record) => `${record.deviceBrand} ${record.deviceModel}`,
        },
        {
            title: "Issue",
            dataIndex: "issueCategory",
            width: 150,
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 140,
            render: (status) => (
                <Tag
                    color={
                        status === "completed"
                            ? "green"
                            : status === "in_progress"
                                ? "blue"
                                : status === "awaiting_parts"
                                    ? "orange"
                                    : status === "new"
                                        ? "gold"
                                        : "red"
                    }
                >
                    {status.toUpperCase().replace(/_/g, " ")}
                </Tag>
            ),
        },
        {
            title: "Priority",
            dataIndex: "priority",
            width: 120,
            render: (priority) => (
                <Tag
                    color={
                        priority === "urgent"
                            ? "red"
                            : priority === "high"
                                ? "orange"
                                : priority === "medium"
                                    ? "blue"
                                    : "default"
                    }
                >
                    {priority.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Store",
            dataIndex: ["assignment", "store"],
            width: 120,
            render: (store) => store || "-",
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            width: 160,
            render: (v) => dayjs(v).format("MMM DD, YYYY"),
        },
        {
            title: "Actions",
            width: 100,
            fixed: "right",
            render: (_, record) => (
                <Button
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => router.push(`/repairs/${record.id}`)}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Card title="Repair Tickets">
                <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }} size="middle">
                    <Search
                        placeholder="Search by ticket#, customer, or device"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchText}
                        style={{ maxWidth: 400 }}
                    />

                    <Space wrap>
                        <Select
                            placeholder="Status"
                            allowClear
                            style={{ width: 150 }}
                            onChange={setStatusFilter}
                            options={[
                                { label: "New", value: "new" },
                                { label: "In Progress", value: "in_progress" },
                                { label: "Awaiting Parts", value: "awaiting_parts" },
                                { label: "Completed", value: "completed" },
                                { label: "Cancelled", value: "cancelled" },
                            ]}
                        />
                        <Select
                            placeholder="Priority"
                            allowClear
                            style={{ width: 150 }}
                            onChange={setPriorityFilter}
                            options={[
                                { label: "Urgent", value: "urgent" },
                                { label: "High", value: "high" },
                                { label: "Medium", value: "medium" },
                                { label: "Low", value: "low" },
                            ]}
                        />
                        <Select
                            placeholder="Store"
                            allowClear
                            style={{ width: 150 }}
                            onChange={setStoreFilter}
                            options={[
                                { label: "Downtown", value: "downtown" },
                                { label: "Mall", value: "mall" },
                                { label: "Airport", value: "airport" },
                            ]}
                        />
                    </Space>
                </Space>

                <Table<RepairTicket>
                    rowKey="id"
                    loading={loading}
                    dataSource={repairs}
                    columns={columns}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} tickets`,
                    }}
                    scroll={{ x: 1400 }}
                />
            </Card>
        </AdminLayout>
    );
}
