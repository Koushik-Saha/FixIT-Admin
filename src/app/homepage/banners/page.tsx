"use client";

import AdminLayout from "@/components/AdminLayout";
import { getHeroSlides, deleteHeroSlide } from "@/lib/api";
import type { HeroSlide } from "@/lib/types";
import { Card, Table, Tag, Space, Button, Image, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSlidesPage() {
    const router = useRouter();
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);

    const loadSlides = async () => {
        setLoading(true);
        try {
            const data = await getHeroSlides() as HeroSlide[];
            setSlides(data);
        } catch (error) {
            message.error("Failed to load slides");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSlides();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteHeroSlide(id);
            message.success("Slide deleted");
            loadSlides();
        } catch (error) {
            message.error("Failed to delete slide");
        }
    };

    const columns = [
        {
            title: "Preview",
            dataIndex: "image",
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
            dataIndex: "ctaPrimary",
            width: 200,
            render: (cta: any) => cta?.link || "-",
        },
        {
            title: "Order",
            dataIndex: "sortOrder",
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
            render: (_: any, record: HeroSlide) => (
                <Space size="small">
                    <Button size="small" icon={<EditOutlined />} onClick={() => router.push(`/homepage/banners/${record.id}/edit`)}>Edit</Button>
                    <Popconfirm title="Delete slide?" onConfirm={() => handleDelete(record.id)}>
                        <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Card
                title="Hero Slides"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/homepage/banners/new")}>
                        Create Slide
                    </Button>
                }
            >
                <Table
                    rowKey="id"
                    loading={loading}
                    dataSource={slides}
                    columns={columns}
                    pagination={false}
                />
            </Card>
        </AdminLayout>
    );
}
