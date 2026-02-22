"use client";

import AdminLayout from "@/components/AdminLayout";
import { getOrder, updateOrder } from "@/lib/api";
import type { Order } from "@/lib/types";
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
    Checkbox,
    message,
    Spin,
    Timeline,
    Divider,
} from "antd";
import {
    ArrowLeftOutlined,
    EditOutlined,
    PrinterOutlined,
    MailOutlined,
} from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const { TextArea } = Input;

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();

    const loadOrder = async () => {
        try {
            const data = await getOrder(params.id as string) as Order;
            setOrder(data);
            form.setFieldsValue({
                status: data.status,
                trackingNumber: data.trackingNumber,
                carrier: data.carrier,
                adminNotes: data.adminNotes,
                sendEmail: true,
            });
        } catch (error) {
            message.error("Failed to load order");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrder();
    }, [params.id]);

    const handleUpdateStatus = async (values: any) => {
        try {
            await updateOrder(params.id as string, values);
            message.success("Order updated successfully");
            setModalOpen(false);
            loadOrder();
        } catch (error) {
            message.error("Failed to update order");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading || !order) {
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

    const itemColumns = [
        {
            title: "Product",
            dataIndex: "productName",
        },
        {
            title: "SKU",
            dataIndex: "sku",
            width: 150,
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            width: 100,
        },
        {
            title: "Price",
            dataIndex: "price",
            width: 120,
            render: (v: number) => `$${v.toFixed(2)}`,
        },
        {
            title: "Discount",
            dataIndex: "discount",
            width: 120,
            render: (v: number) => (v ? `$${v.toFixed(2)}` : "-"),
        },
        {
            title: "Subtotal",
            dataIndex: "subtotal",
            width: 120,
            render: (v: number) => `$${v.toFixed(2)}`,
        },
    ];

    return (
        <AdminLayout>
            <Card
                title={`Order ${order.orderNumber}`}
                extra={
                    <Space>
                        <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                            Print
                        </Button>
                        <Button icon={<MailOutlined />}>Email Customer</Button>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => setModalOpen(true)}
                        >
                            Update Status
                        </Button>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
                            Back
                        </Button>
                    </Space>
                }
            >
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                    <Descriptions title="Order Info" bordered column={2}>
                        <Descriptions.Item label="Order Number">
                            {order.orderNumber}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date">
                            {dayjs(order.createdAt).format("MMM DD, YYYY HH:mm")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Tag
                                color={
                                    order.status === "delivered"
                                        ? "green"
                                        : order.status === "shipped"
                                            ? "blue"
                                            : order.status === "processing"
                                                ? "gold"
                                                : "red"
                                }
                            >
                                {order.status.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Payment Status">
                            <Tag
                                color={
                                    order.paymentStatus === "paid"
                                        ? "green"
                                        : order.paymentStatus === "pending"
                                            ? "gold"
                                            : order.paymentStatus === "refunded"
                                                ? "blue"
                                                : "red"
                                }
                            >
                                {order.paymentStatus.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Payment Method">
                            {order.paymentMethod || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Payment Intent ID">
                            {order.paymentIntentId || "N/A"}
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions title="Customer" bordered column={2}>
                        <Descriptions.Item label="Name">{order.customerName}</Descriptions.Item>
                        <Descriptions.Item label="Email">{order.customerEmail}</Descriptions.Item>
                        <Descriptions.Item label="Phone">
                            {order.customerPhone || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Customer Type">
                            <Tag color={order.customerType === "wholesale" ? "blue" : "default"}>
                                {order.customerType}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>

                    <div>
                        <h3>Items</h3>
                        <Table
                            dataSource={order.items}
                            columns={itemColumns}
                            pagination={false}
                            size="small"
                        />
                    </div>

                    {order.shippingAddress && (
                        <Descriptions title="Shipping" bordered column={2}>
                            <Descriptions.Item label="Address" span={2}>
                                {order.shippingAddress.street}
                                <br />
                                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                {order.shippingAddress.zip}
                                <br />
                                {order.shippingAddress.country}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tracking Number">
                                {order.trackingNumber || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Carrier">
                                {order.carrier || "N/A"}
                            </Descriptions.Item>
                        </Descriptions>
                    )}

                    <Descriptions title="Payment Summary" bordered column={1}>
                        <Descriptions.Item label="Subtotal">
                            ${(order.subtotal || 0).toFixed(2)}
                        </Descriptions.Item>
                        {order.discount && (
                            <Descriptions.Item label="Discount">
                                -${(order.discount || 0).toFixed(2)}
                            </Descriptions.Item>
                        )}
                        {order.shipping && (
                            <Descriptions.Item label="Shipping">
                                ${(order.shipping || 0).toFixed(2)}
                            </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Total">
                            <strong>${(order.total || order.totalAmount || 0).toFixed(2)}</strong>
                        </Descriptions.Item>
                    </Descriptions>

                    {order.timeline && order.timeline.length > 0 && (
                        <div>
                            <h3>Timeline</h3>
                            <Timeline
                                items={order.timeline.map((event) => ({
                                    children: (
                                        <>
                                            <p style={{ margin: 0 }}>
                                                <strong>{event.type}</strong>
                                            </p>
                                            <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
                                                {event.description}
                                            </p>
                                            <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
                                                {dayjs(event.createdAt).format("MMM DD, YYYY HH:mm")}
                                            </p>
                                        </>
                                    ),
                                }))}
                            />
                        </div>
                    )}

                    {order.adminNotes && (
                        <div>
                            <h3>Admin Notes</h3>
                            <p style={{ padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
                                {order.adminNotes}
                            </p>
                        </div>
                    )}
                </Space>
            </Card>

            <Modal
                title="Update Order Status"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={() => form.submit()}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdateStatus}>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: "Please select a status" }]}
                    >
                        <Select
                            options={[
                                { label: "Processing", value: "processing" },
                                { label: "Shipped", value: "shipped" },
                                { label: "Delivered", value: "delivered" },
                                { label: "Cancelled", value: "cancelled" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item noStyle shouldUpdate={(prev, curr) => prev.status !== curr.status}>
                        {({ getFieldValue }) =>
                            getFieldValue("status") === "shipped" ? (
                                <>
                                    <Form.Item name="trackingNumber" label="Tracking Number">
                                        <Input placeholder="Enter tracking number" />
                                    </Form.Item>
                                    <Form.Item name="carrier" label="Carrier">
                                        <Select
                                            placeholder="Select carrier"
                                            options={[
                                                { label: "USPS", value: "USPS" },
                                                { label: "FedEx", value: "FedEx" },
                                                { label: "UPS", value: "UPS" },
                                                { label: "DHL", value: "DHL" },
                                                { label: "Other", value: "Other" },
                                            ]}
                                        />
                                    </Form.Item>
                                </>
                            ) : null
                        }
                    </Form.Item>

                    <Form.Item name="adminNotes" label="Admin Notes">
                        <TextArea rows={3} placeholder="Add internal notes" />
                    </Form.Item>

                    <Form.Item name="sendEmail" valuePropName="checked">
                        <Checkbox>Send email notification to customer</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}
