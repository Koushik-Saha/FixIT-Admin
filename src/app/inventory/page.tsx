// src/app/inventory/page.tsx
"use client";

import AdminLayout from "@/components/AdminLayout";
import { fetchInventory } from "@/lib/mockApi";
import type { InventoryItem } from "@/lib/types";
import { Card, Table, Tag } from "antd";
import { useEffect, useState } from "react";

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);

    useEffect(() => {
        fetchInventory().then(setItems);
    }, []);

    return (
        <AdminLayout>
            <Card title="Inventory Stock Levels">
                <Table<InventoryItem>
                    rowKey="id"
                    dataSource={items}
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    rowClassName={(record) =>
                        record.stock <= record.lowStockThreshold ? "low-stock-row" : ""
                    }
                    columns={[
                        { title: "ID", dataIndex: "id", width: 90 },
                        { title: "SKU", dataIndex: "sku", width: 130 },
                        { title: "Product", dataIndex: "name" },
                        { title: "Location", dataIndex: "location", width: 160 },
                        {
                            title: "Stock",
                            dataIndex: "stock",
                            width: 90,
                            render: (stock, record) =>
                                stock <= record.lowStockThreshold ? (
                                    <Tag color="red">{stock}</Tag>
                                ) : (
                                    stock
                                ),
                        },
                        {
                            title: "Low Stock Threshold",
                            dataIndex: "lowStockThreshold",
                            width: 160,
                        },
                    ]}
                />
            </Card>

            {/* Optional: small CSS tweak for low stock rows */}
            <style jsx global>{`
        .low-stock-row td {
          background-color: #fff1f0 !important;
        }
      `}</style>
        </AdminLayout>
    );
}
