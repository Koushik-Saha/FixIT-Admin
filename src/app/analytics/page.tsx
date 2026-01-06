"use client";

import AdminLayout from "@/components/AdminLayout";
import { getAnalytics } from "@/lib/api";
import { Card, Statistic, Row, Col, Table, Tag, Tabs } from "antd";
import { ArrowUpOutlined, DollarOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnalytics().then((d) => {
            setData(d);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const salesData = [
        { date: "Jan", revenue: 45000, orders: 120 },
        { date: "Feb", revenue: 52000, orders: 145 },
        { date: "Mar", revenue: 61000, orders: 168 },
    ];

    const topProducts = [
        { id: "1", name: "iPhone 14 Pro", sales: 245, revenue: 244755 },
        { id: "2", name: "Samsung Galaxy S23", sales: 189, revenue: 150921 },
        { id: "3", name: "iPad Air", sales: 156, revenue: 93444 },
    ];

    return (
        <AdminLayout>
            <Card title="Analytics Dashboard">
                <Tabs
                    items={[
                        {
                            key: "sales",
                            label: "Sales",
                            children: (
                                <>
                                    <Row gutter={16} style={{ marginBottom: 24 }}>
                                        <Col span={6}>
                                            <Card>
                                                <Statistic
                                                    title="Total Revenue"
                                                    value={158000}
                                                    prefix={<DollarOutlined />}
                                                    suffix={<ArrowUpOutlined style={{ color: "#3f8600" }} />}
                                                />
                                            </Card>
                                        </Col>
                                        <Col span={6}>
                                            <Card>
                                                <Statistic title="Total Orders" value={433} prefix={<ShoppingOutlined />} />
                                            </Card>
                                        </Col>
                                        <Col span={6}>
                                            <Card>
                                                <Statistic title="Avg Order Value" value={365} prefix="$" />
                                            </Card>
                                        </Col>
                                        <Col span={6}>
                                            <Card>
                                                <Statistic title="Conversion Rate" value={3.2} suffix="%" />
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Card title="Revenue Trend">
                                        <Table
                                            dataSource={salesData}
                                            columns={[
                                                { title: "Month", dataIndex: "date" },
                                                { title: "Revenue", dataIndex: "revenue", render: (v) => `$${v.toLocaleString()}` },
                                                { title: "Orders", dataIndex: "orders" },
                                            ]}
                                            pagination={false}
                                        />
                                    </Card>
                                </>
                            ),
                        },
                        {
                            key: "products",
                            label: "Products",
                            children: (
                                <Card title="Top Selling Products">
                                    <Table
                                        dataSource={topProducts}
                                        columns={[
                                            { title: "Product", dataIndex: "name" },
                                            { title: "Units Sold", dataIndex: "sales" },
                                            { title: "Revenue", dataIndex: "revenue", render: (v) => `$${v.toLocaleString()}` },
                                        ]}
                                        pagination={false}
                                    />
                                </Card>
                            ),
                        },
                        {
                            key: "customers",
                            label: "Customers",
                            children: (
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Card>
                                            <Statistic title="Total Customers" value={1284} prefix={<UserOutlined />} />
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card>
                                            <Statistic title="New Customers (30d)" value={156} />
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card>
                                            <Statistic title="Avg Lifetime Value" value={842} prefix="$" />
                                        </Card>
                                    </Col>
                                </Row>
                            ),
                        },
                    ]}
                />
            </Card>
        </AdminLayout>
    );
}
