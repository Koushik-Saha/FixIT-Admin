"use client";

import AdminLayout from "@/components/AdminLayout";
import { getOrders } from "@/lib/api";
import type { Order } from "@/lib/types";
import {
    Card,
    Table,
    Tag,
    Input,
    Space,
    Select,
    DatePicker,
    Button,
    message,
} from "antd";
import { SearchOutlined, EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";

const { Search } = Input;
const { RangePicker } = DatePicker;

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | null>(null);
    const [customerTypeFilter, setCustomerTypeFilter] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (searchText) params.search = searchText;
            if (statusFilter) params.status = statusFilter;
            if (paymentStatusFilter) params.paymentStatus = paymentStatusFilter;
            if (customerTypeFilter) params.customerType = customerTypeFilter;
            if (dateRange) {
                params.startDate = dateRange[0];
                params.endDate = dateRange[1];
            }

            const data = (await getOrders(params)) as any;
            setOrders(data?.data ?? []);
        } catch (error) {
            message.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [searchText, statusFilter, paymentStatusFilter, customerTypeFilter, dateRange]);

    const handleExport = () => {
        const csv = [
            ["Order#", "Date", "Customer", "Email", "Type", "Status", "Payment", "Total"].join(","),
            ...orders.map((o) =>
                [
                    o.orderNumber,
                    o.createdAt,
                    o.customerName,
                    o.customerEmail,
                    o.customerType,
                    o.status,
                    o.paymentStatus,
                    o.total,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `orders-${Date.now()}.csv`;
        a.click();
    };

    const columns: TableColumnsType<Order> = [
        {
            title: "Order#",
            dataIndex: "order_number",
            width: 140,
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            width: 180,
            render: (v) => dayjs(v).format("MMM DD, YYYY HH:mm"),
        },
        {
            title: "Customer",
            dataIndex: "customer_name",
            width: 180,
        },
        {
            title: "Email",
            dataIndex: "customer_email",
            width: 200,
        },
        {
            title: "Type",
            dataIndex: "is_wholesale",
            width: 100,
            render: (is_wholesale) => (
                <Tag color={!is_wholesale ? "blue" : "default"}>
                    {!is_wholesale ? "Regular" : "WholeSales"}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 120,
            render: (status) => (
                <Tag
                    color={
                        status === "delivered"
                            ? "green"
                            : status === "shipped"
                            ? "blue"
                            : status === "processing"
                            ? "gold"
                            : "red"
                    }
                >
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Payment",
            dataIndex: "payment_status",
            width: 120,
            render: (status) => (
                <Tag
                    color={
                        status === "paid"
                            ? "green"
                            : status === "pending"
                            ? "gold"
                            : status === "refunded"
                            ? "blue"
                            : "red"
                    }
                >
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Total",
            dataIndex: "subtotal",
            width: 120,
            render: (v) => `$${v}`,
        },
        {
            title: "Tax",
            dataIndex: "tax_amount",
            width: 120,
            render: (v) => `$${v}`,
        },
        {
            title: "Shipping Cost",
            dataIndex: "shipping_cost",
            width: 120,
            render: (v) => `$${v}`,
        },
        {
            title: "Actions",
            width: 100,
            fixed: "right",
            render: (_, record) => (
                <Button
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => router.push(`/orders/${record.id}`)}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Card
                title="Orders"
                extra={
                    <Button icon={<DownloadOutlined />} onClick={handleExport}>
                        Export CSV
                    </Button>
                }
            >
                <Space orientation="vertical" style={{ width: "100%", marginBottom: 16 }} size="middle">
                    <Search
                        placeholder="Search by order#, customer name, or email"
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={setSearchText}
                        style={{ maxWidth: 400 }}
                    />

                    <Space wrap>
                        <Select
                            placeholder="Status"
                            allowClear
                            style={{ width: 150 }}
                            onChange={setStatusFilter}
                            options={[
                                { label: "Processing", value: "processing" },
                                { label: "Shipped", value: "shipped" },
                                { label: "Delivered", value: "delivered" },
                                { label: "Cancelled", value: "cancelled" },
                            ]}
                        />
                        <Select
                            placeholder="Payment Status"
                            allowClear
                            style={{ width: 150 }}
                            onChange={setPaymentStatusFilter}
                            options={[
                                { label: "Paid", value: "paid" },
                                { label: "Pending", value: "pending" },
                                { label: "Refunded", value: "refunded" },
                                { label: "Failed", value: "failed" },
                            ]}
                        />
                        <Select
                            placeholder="Customer Type"
                            allowClear
                            style={{ width: 150 }}
                            onChange={setCustomerTypeFilter}
                            options={[
                                { label: "Retail", value: "retail" },
                                { label: "Wholesale", value: "wholesale" },
                            ]}
                        />
                        <RangePicker
                            onChange={(dates) => {
                                if (dates) {
                                    setDateRange([
                                        dates[0]!.format("YYYY-MM-DD"),
                                        dates[1]!.format("YYYY-MM-DD"),
                                    ]);
                                } else {
                                    setDateRange(null);
                                }
                            }}
                        />
                    </Space>
                </Space>

                <Table<Order>
                    rowKey="id"
                    loading={loading}
                    dataSource={orders}
                    columns={columns}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} orders`,
                    }}
                    scroll={{ x: 1400 }}
                />
            </Card>
        </AdminLayout>
    );
}
