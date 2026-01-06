"use client";

import AdminLayout from "@/components/AdminLayout";
import { getBanners, deleteBanner } from "@/lib/api";
import type { Banner } from "@/lib/types";
import { Card, Table, Tag, Space, Button, Image, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BannersPage() {
    const router = useRouter();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    const loadBanners = async () => {
        setLoading(true);
        try {
            const data = await getBanners() as Banner[];
            setBanners(data);
        } catch (error) {
            message.error("Failed to load banners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBanners();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteBanner(id);
            message.success("Banner deleted");
            loadBanners();
        } catch (error) {
            message.error("Failed to delete banner");
        }
    };

    const columns = [
        {
            title: "Preview",
            dataIndex: "imageDesktop",
            width: 120,
            render: (url: string) => <Image src={url} width={100} height={50} alt="" />,
        },
        {
            title: "Title",
            dataIndex: "title",
            width: 200,
        },
        {
            title: "Link",
            dataIndex: "linkUrl",
            width: 200,
        },
        {
            title: "Order",
            dataIndex: "displayOrder",
            width: 100,
        },
        {
            title: "Status",
            dataIndex: "isActive",
            width: 100,
            render: (active: boolean) => <Tag color={active ? "green" : "red"}>{active ? "Active" : "Inactive"}</Tag>,
        },
        {
            title: "Actions",
            width: 150,
            render: (_: any, record: Banner) => (
                <Space size="small">
                    <Button size="small" icon={<EditOutlined />} onClick={() => router.push(`/homepage/banners/${record.id}/edit`)}>Edit</Button>
                    <Popconfirm title="Delete banner?" onConfirm={() => handleDelete(record.id)}>
                        <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Card
                title="Homepage Banners"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/homepage/banners/new")}>
                        Create Banner
                    </Button>
                }
            >
                <Table
                    rowKey="id"
                    loading={loading}
                    dataSource={banners}
                    columns={columns}
                    pagination={false}
                />
            </Card>
        </AdminLayout>
    );
}
