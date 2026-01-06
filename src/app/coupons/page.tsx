"use client";

import AdminLayout from "@/components/AdminLayout";
import { getCoupons, deleteCoupon } from "@/lib/api";
import type { Coupon } from "@/lib/types";
import {
    Card,
    Table,
    Tag,
    Space,
    Button,
    message,
    Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";

export default function CouponsPage() {
    const router = useRouter();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    const loadCoupons = async () => {
        setLoading(true);
        try {
            const data = await getCoupons() as Coupon[];
            setCoupons(data);
        } catch (error) {
            message.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCoupons();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteCoupon(id);
            message.success("Coupon deleted");
            loadCoupons();
        } catch (error) {
            message.error("Failed to delete coupon");
        }
    };

    const columns: TableColumnsType<Coupon> = [
        {
            title: "Code",
            dataIndex: "code",
            width: 140,
        },
        {
            title: "Description",
            dataIndex: "description",
            width: 250,
        },
        {
            title: "Type",
            dataIndex: "type",
            width: 120,
            render: (type) => <Tag>{type.toUpperCase()}</Tag>,
        },
        {
            title: "Value",
            dataIndex: "value",
            width: 120,
            render: (value, record) => record.type === "percentage" ? `${value}%` : `$${value}`,
        },
        {
            title: "Usage",
            dataIndex: "usageCount",
            width: 100,
            render: (count, record) => `${count}${record.restrictions.maxUsesTotal ? `/${record.restrictions.maxUsesTotal}` : ""}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 120,
            render: (status) => (
                <Tag color={status === "active" ? "green" : status === "expired" ? "red" : "default"}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Expiry",
            dataIndex: "endDate",
            width: 140,
            render: (date) => date ? dayjs(date).format("MMM DD, YYYY") : "No expiry",
        },
        {
            title: "Actions",
            width: 150,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <Button size="small" icon={<EditOutlined />} onClick={() => router.push(`/coupons/${record.id}/edit`)}>
                        Edit
                    </Button>
                    <Popconfirm title="Delete coupon?" onConfirm={() => handleDelete(record.id)}>
                        <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Card
                title="Coupons"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.push("/coupons/new")}
                    >
                        Create Coupon
                    </Button>
                }
            >
                <Table<Coupon>
                    rowKey="id"
                    loading={loading}
                    dataSource={coupons}
                    columns={columns}
                    pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} coupons` }}
                    scroll={{ x: 1300 }}
                />
            </Card>
        </AdminLayout>
    );
}
