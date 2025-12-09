"use client";

import AdminLayout from "@/components/AdminLayout";
import { Card, Col, Row, Statistic, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { fetchDashboardStats, fetchOrders, fetchRepairs } from "@/lib/mockApi";
import type { Order, RepairTicket } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    openRepairs: 0,
    pendingWholesale: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentRepairs, setRecentRepairs] = useState<RepairTicket[]>([]);

  useEffect(() => {
    fetchDashboardStats().then(setStats);
    fetchOrders().then((o) => setRecentOrders(o.slice(0, 5)));
    fetchRepairs().then((r) => setRecentRepairs(r.slice(0, 5)));
  }, []);

  return (
      <AdminLayout>
        <Row gutter={[16, 16]}>
          <Col xs={12} md={6}>
            <Card>
              <Statistic title="Total Orders" value={stats.totalOrders} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Statistic title="Products" value={stats.totalProducts} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Statistic title="Open Repairs" value={stats.openRepairs} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Statistic
                  title="Wholesale Pending"
                  value={stats.pendingWholesale}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} md={14}>
            <Card title="Recent Orders">
              <Table<Order>
                  size="small"
                  rowKey="id"
                  pagination={false}
                  dataSource={recentOrders}
                  columns={[
                    { title: "Order", dataIndex: "id" },
                    { title: "Customer", dataIndex: "customerName" },
                    { title: "Total", dataIndex: "total", render: (v) => `$${v}` },
                    {
                      title: "Status",
                      dataIndex: "status",
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
                  ]}
              />
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card title="Active Repair Tickets">
              <Table<RepairTicket>
                  size="small"
                  rowKey="id"
                  pagination={false}
                  dataSource={recentRepairs}
                  columns={[
                    { title: "Ticket", dataIndex: "id" },
                    { title: "Customer", dataIndex: "customerName" },
                    { title: "Device", dataIndex: "device" },
                    {
                      title: "Status",
                      dataIndex: "status",
                      render: (status) => (
                          <Tag
                              color={
                                status === "new"
                                    ? "blue"
                                    : status === "in_progress"
                                        ? "gold"
                                        : status === "completed"
                                            ? "green"
                                            : "red"
                              }
                          >
                            {status.toUpperCase()}
                          </Tag>
                      ),
                    },
                  ]}
              />
            </Card>
          </Col>
        </Row>
      </AdminLayout>
  );
}
