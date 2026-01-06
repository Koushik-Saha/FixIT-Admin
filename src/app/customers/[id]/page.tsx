"use client";

import AdminLayout from "@/components/AdminLayout";
import { getCustomer, updateCustomer, resetCustomerPassword, getOrders, getRepairs } from "@/lib/api";
import type { Customer, Order, RepairTicket, Address } from "@/lib/types";
import {
    Card,
    Descriptions,
    Table,
    Tag,
    Space,
    Button,
    Modal,
    Form,
    Select,
    Input,
    message,
    Spin,
    Tabs,
    Popconfirm,
} from "antd";
import {
    ArrowLeftOutlined,
    EditOutlined,
    MailOutlined,
    LockOutlined,
} from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const { TextArea } = Input;

export default function CustomerProfilePage() {
    const router = useRouter();
    const params = useParams();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [repairs, setRepairs] = useState<RepairTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();

    const loadData = async () => {
        try {
            const [customerData, ordersData, repairsData] = await Promise.all([
                getCustomer(params.id as string) as Promise<Customer>,
                getOrders({ customerId: params.id as string }) as Promise<Order[]>,
                getRepairs({ customerId: params.id as string }) as Promise<RepairTicket[]>,
            ]);
            setCustomer(customerData);
            setOrders(ordersData);
            setRepairs(repairsData);
            form.setFieldsValue(customerData);
        } catch (error) {
            message.error("Failed to load customer");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [params.id]);

    const handleUpdate = async (values: any) => {
        try {
            await updateCustomer(params.id as string, values);
            message.success("Customer updated");
            setModalOpen(false);
            loadData();
        } catch (error) {
            message.error("Failed to update customer");
        }
    };

    const handleResetPassword = async () => {
        try {
            await resetCustomerPassword(params.id as string);
            message.success("Password reset email sent");
        } catch (error) {
            message.error("Failed to reset password");
        }
    };

    if (loading || !customer) {
        return (
            <AdminLayout>
                <Card>
                    <div style={{ textAlign: "center", padding: 50 }}>
                        <Spin size="large" />
                    </div>
                </Card>
            </AdminLayout>
        );
    }

    const orderColumns = [
        {
            title: "Order#",
            dataIndex: "orderNumber",
            width: 140,
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            width: 160,
            render: (v: string) => dayjs(v).format("MMM DD, YYYY"),
        },
        {
            title: "Total",
            dataIndex: "total",
            width: 120,
            render: (v: number) => `$${v.toFixed(2)}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 120,
            render: (status: string) => (
                <Tag color={status === "delivered" ? "green" : "blue"}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
    ];

    const repairColumns = [
        {
            title: "Ticket#",
            dataIndex: "ticketNumber",
            width: 140,
        },
        {
            title: "Device",
            render: (_: any, record: RepairTicket) => `${record.device.brand} ${record.device.model}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 140,
            render: (status: string) => (
                <Tag color={status === "completed" ? "green" : "gold"}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Card
                title={`Customer: ${customer.name}`}
                extra={
                    <Space>
                        <Button icon={<MailOutlined />}>Send Email</Button>
                        <Popconfirm title="Send password reset email?" onConfirm={handleResetPassword}>
                            <Button icon={<LockOutlined />}>Reset Password</Button>
                        </Popconfirm>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => setModalOpen(true)}>
                            Edit Profile
                        </Button>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
                            Back
                        </Button>
                    </Space>
                }
            >
                <Tabs
                    items={[
                        {
                            key: "profile",
                            label: "Profile",
                            children: (
                                <Space direction="vertical" style={{ width: "100%" }} size="large">
                                    <Descriptions title="Basic Info" bordered column={2}>
                                        <Descriptions.Item label="Name">{customer.name}</Descriptions.Item>
                                        <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
                                        <Descriptions.Item label="Phone">{customer.phone || "N/A"}</Descriptions.Item>
                                        <Descriptions.Item label="Role">
                                            <Tag color={customer.role === "admin" ? "red" : customer.role === "wholesale" ? "blue" : "default"}>
                                                {customer.role.toUpperCase()}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Status">
                                            <Tag color={customer.isBlocked ? "red" : "green"}>
                                                {customer.isBlocked ? "Blocked" : "Active"}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Member Since">
                                            {dayjs(customer.createdAt).format("MMM DD, YYYY")}
                                        </Descriptions.Item>
                                    </Descriptions>

                                    {customer.role === "wholesale" && (
                                        <Descriptions title="Wholesale Info" bordered column={2}>
                                            <Descriptions.Item label="Status">
                                                <Tag color={customer.wholesaleStatus === "approved" ? "green" : "gold"}>
                                                    {customer.wholesaleStatus?.toUpperCase()}
                                                </Tag>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Tier">
                                                {customer.wholesaleTier || "N/A"}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    )}

                                    <Descriptions title="Statistics" bordered column={2}>
                                        <Descriptions.Item label="Total Orders">{customer.ordersCount}</Descriptions.Item>
                                        <Descriptions.Item label="Total Spent">
                                            ${customer.totalSpent.toFixed(2)}
                                        </Descriptions.Item>
                                    </Descriptions>

                                    {customer.adminNotes && (
                                        <div>
                                            <h3>Admin Notes</h3>
                                            <p style={{ padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
                                                {customer.adminNotes}
                                            </p>
                                        </div>
                                    )}
                                </Space>
                            ),
                        },
                        {
                            key: "orders",
                            label: `Orders (${orders.length})`,
                            children: (
                                <Table
                                    dataSource={orders}
                                    columns={orderColumns}
                                    pagination={{ pageSize: 10 }}
                                    rowKey="id"
                                />
                            ),
                        },
                        {
                            key: "repairs",
                            label: `Repair Tickets (${repairs.length})`,
                            children: (
                                <Table
                                    dataSource={repairs}
                                    columns={repairColumns}
                                    pagination={{ pageSize: 10 }}
                                    rowKey="id"
                                />
                            ),
                        },
                        {
                            key: "addresses",
                            label: "Addresses",
                            children: (
                                <Space direction="vertical" style={{ width: "100%" }}>
                                    {customer.addresses && customer.addresses.length > 0 ? (
                                        customer.addresses.map((addr: Address) => (
                                            <Card key={addr.id} size="small">
                                                <p style={{ margin: 0 }}>{addr.street}</p>
                                                <p style={{ margin: 0 }}>
                                                    {addr.city}, {addr.state} {addr.zip}
                                                </p>
                                                <p style={{ margin: 0 }}>{addr.country}</p>
                                                {addr.isDefault && <Tag color="blue">Default</Tag>}
                                            </Card>
                                        ))
                                    ) : (
                                        <p>No addresses saved</p>
                                    )}
                                </Space>
                            ),
                        },
                    ]}
                />
            </Card>

            <Modal
                title="Edit Customer"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={() => form.submit()}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone">
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label="Role">
                        <Select
                            options={[
                                { label: "Customer", value: "customer" },
                                { label: "Wholesale", value: "wholesale" },
                                { label: "Admin", value: "admin" },
                            ]}
                        />
                    </Form.Item>
                    {form.getFieldValue("role") === "wholesale" && (
                        <Form.Item name="wholesaleTier" label="Wholesale Tier">
                            <Select
                                options={[
                                    { label: "Tier 1", value: "tier1" },
                                    { label: "Tier 2", value: "tier2" },
                                    { label: "Tier 3", value: "tier3" },
                                ]}
                            />
                        </Form.Item>
                    )}
                    <Form.Item name="adminNotes" label="Admin Notes">
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}
