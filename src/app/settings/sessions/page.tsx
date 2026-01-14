"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
    Card,
    Table,
    Button,
    Typography,
    Tag,
    Space,
    message,
    Popconfirm,
} from "antd";
import {
    DesktopOutlined,
    MobileOutlined,
    TabletOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import {
    getSessions,
    revokeSession,
    revokeAllOtherSessions,
} from "@/lib/auth";
import type { Session } from "@/lib/types/auth";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

export default function SessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    const loadSessions = async () => {
        setLoading(true);
        try {
            const data = await getSessions();
            setSessions(data.sessions);
        } catch (error: any) {
            message.error("Failed to load sessions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const handleRevokeSession = async (sessionId: string) => {
        try {
            await revokeSession(sessionId);
            message.success("Session revoked");
            loadSessions();
        } catch (error: any) {
            message.error("Failed to revoke session");
        }
    };

    const handleRevokeAll = async () => {
        try {
            await revokeAllOtherSessions();
            message.success("All other sessions revoked");
            loadSessions();
        } catch (error: any) {
            message.error("Failed to revoke sessions");
        }
    };

    const getDeviceIcon = (deviceInfo: string) => {
        const lower = deviceInfo.toLowerCase();
        if (
            lower.includes("mobile") ||
            lower.includes("android") ||
            lower.includes("iphone")
        ) {
            return <MobileOutlined />;
        }
        if (lower.includes("tablet") || lower.includes("ipad")) {
            return <TabletOutlined />;
        }
        return <DesktopOutlined />;
    };

    const columns: TableColumnsType<Session> = [
        {
            title: "Device",
            dataIndex: "deviceInfo",
            key: "device",
            render: (deviceInfo, record) => (
                <Space>
                    {getDeviceIcon(deviceInfo)}
                    <div>
                        <Text strong>{record.browser}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {deviceInfo}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
            render: (location, record) => (
                <Space direction="vertical" size={0}>
                    {location && (
                        <Text>
                            <EnvironmentOutlined /> {location}
                        </Text>
                    )}
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.ipAddress}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Last Active",
            dataIndex: "lastActive",
            key: "lastActive",
            render: (lastActive) => (
                <Text>
                    <ClockCircleOutlined /> {dayjs(lastActive).fromNow()}
                </Text>
            ),
        },
        {
            title: "Status",
            dataIndex: "isCurrent",
            key: "status",
            render: (isCurrent) =>
                isCurrent ? (
                    <Tag color="green">Current Session</Tag>
                ) : (
                    <Tag>Active</Tag>
                ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) =>
                !record.isCurrent && (
                    <Popconfirm
                        title="Revoke this session?"
                        description="This device will be logged out immediately."
                        onConfirm={() => handleRevokeSession(record.id)}
                        okText="Revoke"
                        cancelText="Cancel"
                    >
                        <Button size="small" danger icon={<DeleteOutlined />}>
                            Revoke
                        </Button>
                    </Popconfirm>
                ),
        },
    ];

    const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

    return (
        <AdminLayout>
            <Card
                title={
                    <div>
                        <Title level={4} style={{ margin: 0 }}>
                            Active Sessions
                        </Title>
                        <Text type="secondary">
                            Manage devices that are currently logged into your account
                        </Text>
                    </div>
                }
                extra={
                    otherSessionsCount > 0 && (
                        <Popconfirm
                            title={`Revoke all ${otherSessionsCount} other sessions?`}
                            description="All other devices will be logged out immediately."
                            onConfirm={handleRevokeAll}
                            okText="Revoke All"
                            cancelText="Cancel"
                        >
                            <Button danger>Logout All Other Devices</Button>
                        </Popconfirm>
                    )
                }
            >
                <Table
                    rowKey="id"
                    loading={loading}
                    dataSource={sessions}
                    columns={columns}
                    pagination={false}
                />
            </Card>
        </AdminLayout>
    );
}
