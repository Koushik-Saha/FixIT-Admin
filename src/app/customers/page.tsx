"use client";

import AdminLayout from "@/components/AdminLayout";
import { getCustomers, blockCustomer } from "@/lib/api";
import type { Customer } from "@/lib/types";
import {
    Card,
    Table,
    Tag,
    Input,
    Space,
    Select,
    Button,
    message,
    Popconfirm,
} from "antd";
import { SearchOutlined, EyeOutlined, EditOutlined, StopOutlined, CheckOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";

const { Search } = Input;

export default function CustomersPage() {
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [wholesaleStatusFilter, setWholesaleStatusFilter] = useState<string | null>(null);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (searchText) params.search = searchText;
            if (roleFilter) params.role = roleFilter;
            if (wholesaleStatusFilter) params.wholesaleStatus = wholesaleStatusFilter;

            const data = await getCustomers(params) as Customer[];
            setCustomers(data);
        } catch (error) {
            message.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, [searchText, roleFilter, wholesaleStatusFilter]);

    const handleBlock = async (id: string, blocked: boolean) => {
        try {
            await blockCustomer(id, blocked);
            message.success(blocked ? "Customer blocked" : "Customer unblocked");
            loadCustomers();
        } catch (error) {
            message.error("Failed to update customer");
        }
    };

    const columns: TableColumnsType<Customer> = [
        {
            title: "Name",
            dataIndex: "name",
            width: 200,
        },
        {
            title: "Email",
            dataIndex: "email",
            width: 220,
        },
        {
            title: "Role",
            dataIndex: "role",
            width: 120,
            render: (role) => (
                <Tag color={role === "admin" ? "red" : role === "wholesale" ? "blue" : "default"}>
                    {role.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Orders",
            dataIndex: "ordersCount",
            width: 100,
        },
        {
            title: "Total Spent",
            dataIndex: "totalSpent",
            width: 140,
            render: (v) => `$${v.toFixed(2)}`,
        },
        {
            title: "Wholesale Status",
            dataIndex: "wholesaleStatus",
            width: 160,
            render: (status) => {
                if (!status) return "-";
                return (
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
                );
            },
        },
        {
            title: "Status",
            dataIndex: "isBlocked",
            width: 100,
            render: (isBlocked) => (
                <Tag color={isBlocked ? "red" : "green"}>
                    {isBlocked ? "Blocked" : "Active"}
                </Tag>
            ),
        },
        {
            title: "Actions",
            width: 220,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => router.push(`/customers/${record.id}`)}
                    >
                        View
                    </Button>
                    <Button size="small" icon={<EditOutlined />}>
                        Edit
                    </Button>
                    <Popconfirm
                        title={record.isBlocked ? "Unblock customer?" : "Block customer?"}
                        onConfirm={() => handleBlock(record.id, !record.isBlocked)}
                    >
                        <Button
                            size="small"
                            danger={!record.isBlocked}
                            icon={record.isBlocked ? <CheckOutlined /> : <StopOutlined />}
                        >
                            {record.isBlocked ? "Unblock" : "Block"}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Card title="Customers">
                <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }} size="middle">
                    <Search
                        placeholder="Search by name, email, or phone"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchText}
                        style={{ maxWidth: 400 }}
                    />

                    <Space wrap>
                        <Select
                            placeholder="Role"
                            allowClear
                            style={{ width: 150 }}
                            onChange={setRoleFilter}
                            options={[
                                { label: "Customer", value: "customer" },
                                { label: "Wholesale", value: "wholesale" },
                                { label: "Admin", value: "admin" },
                            ]}
                        />
                        <Select
                            placeholder="Wholesale Status"
                            allowClear
                            style={{ width: 180 }}
                            onChange={setWholesaleStatusFilter}
                            options={[
                                { label: "Pending", value: "pending" },
                                { label: "Approved", value: "approved" },
                                { label: "Rejected", value: "rejected" },
                            ]}
                        />
                    </Space>
                </Space>

                <Table<Customer>
                    rowKey="id"
                    loading={loading}
                    dataSource={customers}
                    columns={columns}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} customers`,
                    }}
                    scroll={{ x: 1400 }}
                />
            </Card>
        </AdminLayout>
    );
}
