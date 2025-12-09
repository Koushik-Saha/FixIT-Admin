"use client";

import React, { useState } from "react";
import {
    Layout,
    Menu,
    theme,
    Grid,
    Typography,
} from "antd";
import {
    DashboardOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    ToolOutlined,
    TeamOutlined,
    DollarOutlined,
    DatabaseOutlined, FormOutlined, PercentageOutlined, UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useRouter, usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

type AdminLayoutProps = {
    children: React.ReactNode;
};

const items: MenuProps["items"] = [
    { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/products", icon: <ShoppingOutlined />, label: "Products" },
    { key: "/orders", icon: <ShoppingCartOutlined />, label: "Orders" },
    { key: "/repairs", icon: <ToolOutlined />, label: "Repair Tickets" },
    { key: "/wholesale", icon: <TeamOutlined />, label: "Wholesale Accounts" },
    { key: "/pricing-tiers", icon: <DollarOutlined />, label: "Pricing Tiers" },
    { key: "/inventory", icon: <DatabaseOutlined />, label: "Inventory" },

    // 🔽 NEW
    { key: "/product-input", icon: <FormOutlined />, label: "Product Input" },
    { key: "/bulk-pricing", icon: <PercentageOutlined />, label: "Bulk Pricing" },
    { key: "/users", icon: <UserOutlined />, label: "User Management" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const router = useRouter();
    const pathname = usePathname();
    const screens = useBreakpoint();

    const [collapsed, setCollapsed] = useState(false);

    const onMenuClick: MenuProps["onClick"] = (info) => {
        router.push(info.key);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                breakpoint="lg"
                theme="dark"
            >
                <div
                    style={{
                        height: 64,
                        margin: 16,
                        borderRadius: 8,
                        border: "1px solid rgba(148,163,184,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        color: "#38bdf8",
                        fontSize: collapsed ? 14 : 18,
                    }}
                >
                    {collapsed ? "FixIt" : "FixIt Admin"}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[pathname === "/" ? "/" : pathname]}
                    items={items}
                    onClick={onMenuClick}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: screens.xs ? "0 16px" : "0 24px",
                        background: "#020617",
                        borderBottom: "1px solid rgba(148,163,184,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={{ color: "#e5e7eb", fontWeight: 600 }}>
                        Max FixIt
                    </Text>
                    <Text type="secondary" style={{ color: "#9ca3af" }}>
                        Control Everything
                    </Text>
                </Header>
                <Content
                    style={{
                        margin: 0,
                        padding: screens.xs ? 16 : 24,
                        background: "#0b1120",
                    }}
                >
                    <div
                        style={{
                            padding: screens.xs ? 12 : 20,
                            minHeight: "calc(100vh - 112px)",
                            background: colorBgContainer,
                            borderRadius: 16,
                        }}
                    >
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
