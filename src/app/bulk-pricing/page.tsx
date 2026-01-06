"use client";

import AdminLayout from "@/components/AdminLayout";
import { fetchProducts } from "@/lib/mockApi";
import type { Product } from "@/lib/types";
import {
    Button,
    Card,
    Col,
    Form,
    InputNumber,
    Row,
    Table,
    Tag,
    Typography,
    message,
} from "antd";
import { useEffect, useMemo, useState } from "react";

const { Text } = Typography;

export default function BulkPricingPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [retailDelta, setRetailDelta] = useState<number>(0);
    const [wholesaleDelta, setWholesaleDelta] = useState<number>(0);

    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);

    const previewProducts = useMemo(() => {
        const rm = 1 + (retailDelta || 0) / 100;
        const wm = 1 + (wholesaleDelta || 0) / 100;

        return products.map((p) => {
            const currentWholesale = p.wholesaleDiscounts?.tier1
                ? p.basePrice * (1 - p.wholesaleDiscounts.tier1 / 100)
                : p.basePrice * 0.9; // default 10% discount

            return {
                ...p,
                currentRetail: p.basePrice,
                currentWholesale,
                newRetail: p.basePrice * rm,
                newWholesale: currentWholesale * wm,
            };
        });
    }, [products, retailDelta, wholesaleDelta]);

    const applyChanges = () => {
        const rm = 1 + (retailDelta || 0) / 100;
        const wm = 1 + (wholesaleDelta || 0) / 100;

        setProducts((prev) =>
            prev.map((p) => {
                const newBasePrice = parseFloat((p.basePrice * rm).toFixed(2));
                const updatedDiscounts = p.wholesaleDiscounts ? {
                    tier1: p.wholesaleDiscounts.tier1,
                    tier2: p.wholesaleDiscounts.tier2,
                    tier3: p.wholesaleDiscounts.tier3,
                } : undefined;

                return {
                    ...p,
                    basePrice: newBasePrice,
                    wholesaleDiscounts: updatedDiscounts,
                };
            }),
        );

        setRetailDelta(0);
        setWholesaleDelta(0);
        message.success("Bulk price changes applied locally.");

        // 🔁 Later: send rm & wm to your backend to update all products
        // await api.bulkUpdatePrices({ retailDelta, wholesaleDelta })
    };

    return (
        <AdminLayout>
            <Card title="Bulk Price Adjustments">
                <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                        <Form layout="vertical">
                            <Form.Item label="Retail price adjustment (%)">
                                <InputNumber
                                    value={retailDelta}
                                    onChange={(v) => setRetailDelta(v ?? 0)}
                                    style={{ width: "100%" }}
                                    addonAfter="%"
                                    step={0.5}
                                    min={-100}
                                    max={200}
                                />
                                <Text type="secondary">
                                    Positive value = increase. Negative = discount. Applies to
                                    regular customer prices.
                                </Text>
                            </Form.Item>

                            <Form.Item label="Wholesale price adjustment (%)">
                                <InputNumber
                                    value={wholesaleDelta}
                                    onChange={(v) => setWholesaleDelta(v ?? 0)}
                                    style={{ width: "100%" }}
                                    addonAfter="%"
                                    step={0.5}
                                    min={-100}
                                    max={200}
                                />
                                <Text type="secondary">
                                    Applies only to wholesale customer pricing.
                                </Text>
                            </Form.Item>

                            <Button
                                type="primary"
                                onClick={applyChanges}
                                disabled={!products.length}
                            >
                                Apply Changes to All Products
                            </Button>
                        </Form>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card
                            size="small"
                            title="Hint"
                            style={{ background: "#f9fafb" }}
                        >
                            <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                                <li>Use this when supplier cost changes.</li>
                                <li>
                                    You can keep wholesale price increases smaller than retail.
                                </li>
                                <li>
                                    For example: set Retail = 10%, Wholesale = 5% to protect your
                                    shops.
                                </li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            </Card>

            <Card
                title="Price Preview (before applying to backend)"
                style={{ marginTop: 24 }}
            >
                <Table<
                        Product & { currentRetail: number; currentWholesale: number; newRetail: number; newWholesale: number }
                    >
                    rowKey="id"
                    dataSource={previewProducts}
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    columns={[
                        { title: "Product", dataIndex: "name" },
                        { title: "SKU", dataIndex: "sku" },
                        {
                            title: "Current Retail",
                            dataIndex: "currentRetail",
                            render: (v) => `$${v.toFixed(2)}`,
                        },
                        {
                            title: "New Retail",
                            dataIndex: "newRetail",
                            render: (v) => (
                                <Tag color={retailDelta === 0 ? "default" : retailDelta > 0 ? "red" : "green"}>
                                    ${v.toFixed(2)}
                                </Tag>
                            ),
                        },
                        {
                            title: "Current Wholesale",
                            dataIndex: "currentWholesale",
                            render: (v) => `$${v.toFixed(2)}`,
                        },
                        {
                            title: "New Wholesale",
                            dataIndex: "newWholesale",
                            render: (v) => (
                                <Tag
                                    color={
                                        wholesaleDelta === 0 ? "default" : wholesaleDelta > 0 ? "red" : "green"
                                    }
                                >
                                    ${v.toFixed(2)}
                                </Tag>
                            ),
                        },
                    ]}
                />
            </Card>
        </AdminLayout>
    );
}
