"use client";

import React, { useState } from "react";
import {
    Layout,
    Menu,
    theme,
    Grid,
    Typography,
    Badge,
    Space,
} from "antd";
import {
    DashboardOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
    ToolOutlined,
    TeamOutlined,
    DollarOutlined,
    DatabaseOutlined,
    UserOutlined,
    PercentageOutlined,
    FormOutlined,
    BellOutlined,
    TagOutlined,
    BarChartOutlined,
    SettingOutlined,
    HomeOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import UserMenu from "./UserMenu";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

type AdminLayoutProps = {
    children: React.ReactNode;
};

const items: MenuProps["items"] = [
    { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/analytics", icon: <BarChartOutlined />, label: "Analytics" },
    { key: "/products", icon: <ShoppingOutlined />, label: "Products" },
    { key: "/orders", icon: <ShoppingCartOutlined />, label: "Orders" },
    { key: "/customers", icon: <UserOutlined />, label: "Customers" },
    { key: "/repairs", icon: <ToolOutlined />, label: "Repair Tickets" },
    { key: "/wholesale-applications", icon: <TeamOutlined />, label: "Wholesale Apps" },
    { key: "/inventory", icon: <DatabaseOutlined />, label: "Inventory" },
    { key: "/coupons", icon: <TagOutlined />, label: "Coupons" },
    { key: "/homepage/banners", icon: <HomeOutlined />, label: "Homepage" },
    { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
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
        <Layout style={{ minHeight: "100vh", background: "#020617" }}>
            {/* Sidebar with logo */}
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                breakpoint="lg"
                theme="dark"
                width={220}
                style={{ background: "#020617" }}
            >
                <div
                    style={{
                        height: 64,
                        margin: 16,
                        borderRadius: 12,
                        border: "1px solid rgba(148,163,184,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: collapsed ? "center" : "flex-start",
                        paddingInline: collapsed ? 0 : 12,
                        gap: 10,
                        background:
                            "radial-gradient(circle at top left, #22d3ee33, #020617)",
                    }}
                >
                    {/* Logo image */}
                    <Image
                        src="/fix_it_logo.png"
                        alt="FixIt logo"
                        width={32}
                        height={32}
                        style={{ borderRadius: 8 }}
                    />
                    {!collapsed && (
                        <span
                            style={{
                                color: "#e5e7eb",
                                fontWeight: 700,
                                letterSpacing: 0.4,
                                fontSize: 16,
                            }}
                        >
              FixIt Admin
            </span>
                    )}
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[pathname === "/" ? "/" : pathname]}
                    items={items}
                    onClick={onMenuClick}
                    style={{ background: "#020617" }}
                />
            </Sider>

            {/* Main area */}
            <Layout>
                {/* Top header bar */}
                <Header
                    style={{
                        padding: screens.xs ? "8px 12px" : "12px 24px",
                        background: "#020617",
                        borderBottom: "1px solid rgba(148,163,184,0.25)",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            borderRadius: 20,
                            padding: screens.xs ? "10px 14px" : "12px 20px",
                            background:
                                "linear-gradient(90deg, #020617 0%, #020617 30%, #0b1120 70%, #020617 100%)",
                            border: "1px solid rgba(148,163,184,0.45)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 16,
                        }}
                    >
                        {/* Left side: title + subtitle */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                                minWidth: 0,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#e5e7eb",
                                    fontWeight: 600,
                                    fontSize: screens.xs ? 14 : 16,
                                }}
                                ellipsis
                            >
                                FixIt Admin Console
                            </Text>
                            <Text
                                style={{
                                    color: "#9ca3af",
                                    fontSize: 12,
                                }}
                                ellipsis
                            >
                                Manage products, orders, repairs & wholesale accounts from one
                                place.
                            </Text>
                        </div>

                        {/* Right side: environment + notifications */}
                        <Space size={16} align="center" wrap>
                            <div
                                style={{
                                    padding: "3px 10px",
                                    background: "rgba(22,163,74,0.12)",
                                    border: "1px solid rgba(22,163,74,0.5)",
                                    fontSize: 11,
                                    color: "#bbf7d0",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                <span
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: "999px",
                        background: "#22c55e",
                    }}
                />
                                Live environment
                            </div>

                            <Badge dot>
                                <BellOutlined
                                    style={{ fontSize: 18, color: "#e5e7eb", cursor: "pointer" }}
                                />
                            </Badge>

                            <UserMenu />
                        </Space>
                    </div>
                </Header>


                <Content
                    style={{
                        margin: 0,
                        padding: screens.xs ? 16 : 24,
                        background: "#020617",
                    }}
                >
                    <div
                        style={{
                            padding: screens.xs ? 12 : 20,
                            minHeight: "calc(100vh - 112px)",
                            background: colorBgContainer,
                            borderRadius: 18,
                        }}
                    >
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
