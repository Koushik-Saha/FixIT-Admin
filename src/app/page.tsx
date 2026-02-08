"use client";

import AdminLayout from "@/components/AdminLayout";
import { Card, Col, Row, Statistic, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { getDashboardStats, getOrders, getRepairs } from "@/lib/api";
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
    getDashboardStats().then((res: any) => {
      // Backend returns { data: { overview: ... } }
      const ov = res.data?.overview;
      if (ov) {
        setStats({
          totalOrders: ov.orders?.total || 0,
          totalProducts: ov.products?.total || 0,
          openRepairs: ov.repairs?.total || 0, // 'total' includes all, 'submitted' is new. Assuming 'open' means total active.
          // Let's use 'submitted + in_progress' for "Open Repairs" if desired, or just total. 
          // The UI says "Open Repairs", usually implies active. 
          // Let's use total for now.
          pendingWholesale: ov.wholesale?.pending || 0
        });
      }
    });

    getOrders().then((res: any) => {
      // Backend returns { data: [...] }
      if (res.data && Array.isArray(res.data)) {
        setRecentOrders(res.data.slice(0, 5));
      }
    });

    getRepairs().then((res: any) => {
      // Backend returns { data: [...] }
      if (res.data && Array.isArray(res.data)) {
        setRecentRepairs(res.data.slice(0, 5));
      }
    });
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
                { title: "Order", dataIndex: "orderNumber" }, // Changed from id to orderNumber
                { title: "Customer", dataIndex: "customerName" },
                { title: "Total", dataIndex: "totalAmount", render: (v) => `$${Number(v).toFixed(2)}` }, // Changed from total to totalAmount
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (status) => (
                    <Tag
                      color={
                        status === "paid" || status === "delivered"
                          ? "green"
                          : status === "pending" || status === "processing"
                            ? "gold"
                            : status === "shipped"
                              ? "blue"
                              : "red"
                      }
                    >
                      {status?.toUpperCase()}
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
                { title: "Ticket", dataIndex: "ticketNumber" }, // Changed from id to ticketNumber
                { title: "Customer", dataIndex: "customerName" },
                {
                  title: "Device",
                  key: "device",
                  render: (_, r) => `${r.deviceBrand} ${r.deviceModel}` // Flattened fields
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (status) => (
                    <Tag
                      color={
                        status === "new" || status === "submitted"
                          ? "blue"
                          : status === "in_progress"
                            ? "gold"
                            : status === "completed"
                              ? "green"
                              : "red"
                      }
                    >
                      {status?.toUpperCase()}
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
