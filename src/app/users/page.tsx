"use client";

import AdminLayout from "@/components/AdminLayout";
import { getUsers, toggleBlockUser } from "@/lib/api";
import {
    Button,
    Card,
    Input,
    message,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Tabs
} from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [searchText, setSearchText] = useState("");
    const [total, setTotal] = useState(0);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });

    const fetchUsers = async (page = 1, role = "ALL", search = "") => {
        setLoading(true);
        try {
            const params: any = { page: page.toString(), limit: pagination.pageSize.toString() };
            if (role !== "ALL") params.role = role;
            if (search) params.search = search;

            const res = await getUsers(params);
            setUsers(res.data);
            setTotal(res.pagination.total);
            setPagination(prev => ({ ...prev, current: page }));
        } catch (error) {
            message.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1, roleFilter, searchText);
    }, [roleFilter]); // Search text handled by button/enter

    const handleSearch = () => {
        fetchUsers(1, roleFilter, searchText);
    };

    const handleBlockToggle = async (id: string, currentStatus: boolean) => {
        try {
            await toggleBlockUser(id, !currentStatus);
            message.success(`User ${!currentStatus ? 'blocked' : 'unblocked'} successfully`);
            fetchUsers(pagination.current, roleFilter, searchText);
        } catch (error) {
            message.error("Failed to update block status");
        }
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "fullName",
            key: "fullName",
            render: (text: string, record: any) => (
                <Link href={`/users/${record.id}`} style={{ fontWeight: 500 }}>
                    {text || "N/A"}
                </Link>
            )
        },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone", dataIndex: "phone", key: "phone" },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role: string) => {
                const color = role === 'ADMIN' ? 'purple' : role === 'WHOLESALE' ? 'blue' : 'default';
                return <Tag color={color}>{role}</Tag>;
            }
        },
        {
            title: "Status",
            dataIndex: "isBlocked",
            key: "isBlocked",
            render: (blocked: boolean) => (
                <Tag color={blocked ? "red" : "success"}>
                    {blocked ? "BLOCKED" : "ACTIVE"}
                </Tag>
            )
        },
        {
            title: "Stats",
            key: "stats",
            render: (_: any, record: any) => (
                <Space size="small" style={{ fontSize: 12, color: '#888' }}>
                    <span>Orders: {record._count?.orders || 0}</span>
                </Space>
            )
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space>
                    <Link href={`/users/${record.id}`}>
                        <Button size="small">Edit</Button>
                    </Link>
                    <Popconfirm
                        title={`${record.isBlocked ? "Unblock" : "Block"} this user?`}
                        onConfirm={() => handleBlockToggle(record.id, record.isBlocked)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button size="small" danger={!record.isBlocked} type={record.isBlocked ? 'default' : 'primary'} ghost>
                            {record.isBlocked ? "Unblock" : "Block"}
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <AdminLayout>
            <Card title="User Management" extra={
                <Space>
                    <Input
                        placeholder="Search name, email, phone"
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        onPressEnter={handleSearch}
                        style={{ width: 250 }}
                        suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer' }} />}
                    />
                </Space>
            }>
                <Tabs
                    activeKey={roleFilter}
                    onChange={setRoleFilter}
                    items={[
                        { key: "ALL", label: "All Users" },
                        { key: "CUSTOMER", label: "Customers" },
                        { key: "WHOLESALE", label: "Wholesale" },
                        { key: "ADMIN", label: "Admins" },
                    ]}
                />

                <Table
                    rowKey="id"
                    loading={loading}
                    dataSource={users}
                    columns={columns}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: total,
                        onChange: (page) => fetchUsers(page, roleFilter, searchText)
                    }}
                />
            </Card>
        </AdminLayout>
    );
}
