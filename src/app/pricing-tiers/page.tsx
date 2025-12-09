// src/app/pricing-tiers/page.tsx
"use client";

import AdminLayout from "@/components/AdminLayout";
import { fetchPricingTiers } from "@/lib/mockApi";
import type { PricingTier } from "@/lib/types";
import {
    Button,
    Card,
    Form,
    InputNumber,
    Modal,
    Table,
    Typography,
} from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

export default function PricingTiersPage() {
    const [tiers, setTiers] = useState<PricingTier[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<PricingTier | null>(null);
    const [form] = Form.useForm<PricingTier>();

    useEffect(() => {
        fetchPricingTiers().then(setTiers);
    }, []);

    const openEdit = (tier: PricingTier) => {
        setEditing(tier);
        form.setFieldsValue(tier);
        setOpen(true);
    };

    const onFinish = (values: PricingTier) => {
        setTiers((prev) =>
            prev.map((t) =>
                t.id === editing?.id ? { ...t, ...values, id: editing.id } : t,
            ),
        );
        setOpen(false);
    };

    return (
        <AdminLayout>
            <Card title="Pricing Tier Controls">
                <Text type="secondary">
                    Configure wholesale discount levels and minimum monthly spend.
                </Text>

                <Table<PricingTier>
                    style={{ marginTop: 16 }}
                    rowKey="id"
                    dataSource={tiers}
                    pagination={false}
                    size="middle"
                    columns={[
                        { title: "Tier", dataIndex: "name" },
                        {
                            title: "Discount",
                            dataIndex: "discountPercent",
                            render: (v) => `${v}%`,
                        },
                        {
                            title: "Min Monthly Spend",
                            dataIndex: "minMonthlySpend",
                            render: (v) => `$${v.toLocaleString()}`,
                        },
                        {
                            title: "Actions",
                            render: (_, record) => (
                                <Button size="small" onClick={() => openEdit(record)}>
                                    Edit
                                </Button>
                            ),
                        },
                    ]}
                />

                <Modal
                    open={open}
                    title={`Edit Tier: ${editing?.name ?? ""}`}
                    onCancel={() => setOpen(false)}
                    onOk={() => form.submit()}
                    okText="Save"
                >
                    <Form<PricingTier> form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            name="discountPercent"
                            label="Discount %"
                            rules={[{ required: true }]}
                        >
                            <InputNumber min={0} max={80} style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item
                            name="minMonthlySpend"
                            label="Min Monthly Spend ($)"
                            rules={[{ required: true }]}
                        >
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </AdminLayout>
    );
}
