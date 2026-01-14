"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Dropdown, Avatar, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    LockOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export default function UserMenu() {
    const { user, logout } = useAuth();
    const router = useRouter();

    if (!user) return null;

    const items: MenuProps["items"] = [
        {
            key: "user-info",
            label: (
                <div style={{ padding: "8px 0" }}>
                    <Text strong>{user.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {user.email}
                    </Text>
                </div>
            ),
            disabled: true,
        },
        { type: "divider" },
        {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Settings",
            onClick: () => router.push("/settings"),
        },
        {
            key: "sessions",
            icon: <LockOutlined />,
            label: "Active Sessions",
            onClick: () => router.push("/settings/sessions"),
        },
        { type: "divider" },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: logout,
            danger: true,
        },
    ];

    return (
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
                <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                />
                <Text style={{ color: "#e5e7eb" }}>{user.name}</Text>
            </Space>
        </Dropdown>
    );
}
