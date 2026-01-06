"use client";

import AdminLayout from "@/components/AdminLayout";
import { getWholesaleApplications, reviewWholesaleApplication } from "@/lib/api";
import type { WholesaleApplication } from "@/lib/types";
import {
    Card,
    Table,
    Tag,
    Input,
    Space,
    Button,
    message,
    Tabs,
    Popconfirm,
} from "antd";
import { SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";

const { Search } = Input;

export default function WholesaleApplicationsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState<WholesaleApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [activeTab, setActiveTab] = useState("pending");

    const loadApplications = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = { status: activeTab };
            if (searchText) params.search = searchText;

            const data = await getWholesaleApplications(params);
            setApplications(data);
        } catch (error) {
            message.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, [searchText, activeTab]);

    const handleQuickApprove = async (id: string) => {
        try {
            await reviewWholesaleApplication(id, { status: "approved", tier: "tier1" });
            message.success("Application approved");
            loadApplications();
        } catch (error) {
            message.error("Failed to approve application");
        }
    };

    const handleQuickReject = async (id: string) => {
        try {
            await reviewWholesaleApplication(id, { status: "rejected" });
            message.success("Application rejected");
            loadApplications();
        } catch (error) {
            message.error("Failed to reject application");
        }
    };

    const columns: TableColumnsType<WholesaleApplication> = [
        {
            title: "Business Name",
            dataIndex: ["businessInfo", "name"],
            width: 200,
        },
        {
            title: "Contact",
            dataIndex: ["contact", "name"],
            width: 160,
        },
        {
            title: "Email",
            dataIndex: ["contact", "email"],
            width: 200,
        },
        {
            title: "Business Type",
            dataIndex: ["businessInfo", "type"],
            width: 140,
        },
        {
            title: "Requested Tier",
            dataIndex: "requestedTier",
            width: 140,
            render: (tier) => <Tag color="blue">{tier.toUpperCase()}</Tag>,
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            width: 160,
            render: (v) => dayjs(v).format("MMM DD, YYYY"),
        },
        {
            title: "Actions",
            width: 260,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => router.push(`/wholesale-applications/${record.id}`)}
                    >
                        Review
                    </Button>
                    {activeTab === "pending" && (
                        <>
                            <Popconfirm
                                title="Approve application?"
                                onConfirm={() => handleQuickApprove(record.id)}
                            >
                                <Button size="small" type="primary" icon={<CheckOutlined />}>
                                    Approve
                                </Button>
                            </Popconfirm>
                            <Popconfirm
                                title="Reject application?"
                                onConfirm={() => handleQuickReject(record.id)}
                            >
                                <Button size="small" danger icon={<CloseOutlined />}>
                                    Reject
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Card title="Wholesale Applications">
                <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }} size="middle">
                    <Search
                        placeholder="Search by business name or email"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchText}
                        style={{ maxWidth: 400 }}
                    />
                </Space>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            key: "pending",
                            label: "Pending",
                            children: (
                                <Table<WholesaleApplication>
                                    rowKey="id"
                                    loading={loading}
                                    dataSource={applications}
                                    columns={columns}
                                    pagination={{
                                        pageSize: 10,
                                        showTotal: (total) => `Total ${total} applications`,
                                    }}
                                    scroll={{ x: 1400 }}
                                />
                            ),
                        },
                        {
                            key: "approved",
                            label: "Approved",
                            children: (
                                <Table<WholesaleApplication>
                                    rowKey="id"
                                    loading={loading}
                                    dataSource={applications}
                                    columns={columns}
                                    pagination={{
                                        pageSize: 10,
                                        showTotal: (total) => `Total ${total} applications`,
                                    }}
                                    scroll={{ x: 1400 }}
                                />
                            ),
                        },
                        {
                            key: "rejected",
                            label: "Rejected",
                            children: (
                                <Table<WholesaleApplication>
                                    rowKey="id"
                                    loading={loading}
                                    dataSource={applications}
                                    columns={columns}
                                    pagination={{
                                        pageSize: 10,
                                        showTotal: (total) => `Total ${total} applications`,
                                    }}
                                    scroll={{ x: 1400 }}
                                />
                            ),
                        },
                    ]}
                />
            </Card>
        </AdminLayout>
    );
}
