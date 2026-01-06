"use client";

import AdminLayout from "@/components/AdminLayout";
import { bulkImportProducts } from "@/lib/api";
import {
    Button,
    Card,
    Upload,
    message,
    Space,
    Table,
    Alert,
    Progress,
} from "antd";
import { ArrowLeftOutlined, UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UploadFile } from "antd";

export default function BulkImportPage() {
    const router = useRouter();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [importing, setImporting] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (info: any) => {
        setFileList(info.fileList);

        if (info.file.status === "done" || info.file.originFileObj) {
            const file = info.file.originFileObj;
            const reader = new FileReader();

            reader.onload = (e) => {
                const text = e.target?.result as string;
                const rows = text.split("\n").map((row) => row.split(","));
                const headers = rows[0];
                const data = rows.slice(1, 6).map((row) => {
                    const obj: any = {};
                    headers.forEach((header, index) => {
                        obj[header.trim()] = row[index]?.trim();
                    });
                    return obj;
                });
                setPreviewData(data);
            };

            reader.readAsText(file);
        }
    };

    const handleImport = async () => {
        if (fileList.length === 0) {
            message.error("Please upload a CSV file");
            return;
        }

        setImporting(true);
        setProgress(0);

        try {
            const file = fileList[0].originFileObj;
            const reader = new FileReader();

            reader.onload = async (e) => {
                const text = e.target?.result as string;
                const rows = text.split("\n").map((row) => row.split(","));
                const headers = rows[0];
                const data = rows.slice(1).filter(row => row.length > 1).map((row) => {
                    const obj: any = {};
                    headers.forEach((header, index) => {
                        obj[header.trim()] = row[index]?.trim();
                    });
                    return obj;
                });

                for (let i = 0; i < data.length; i++) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    setProgress(Math.round(((i + 1) / data.length) * 100));
                }

                await bulkImportProducts({ products: data });
                message.success(`${data.length} products imported successfully`);
                router.push("/products");
            };

            reader.readAsText(file);
        } catch (error) {
            message.error("Failed to import products");
        } finally {
            setImporting(false);
        }
    };

    const downloadTemplate = () => {
        const template = `SKU,Name,Brand,Model,Category,BasePrice,Stock,LowStockThreshold,IsActive
IPH14P-256,iPhone 14 Pro,Apple,14 Pro,smartphones,999,50,10,true
SAM-S23-128,Samsung Galaxy S23,Samsung,S23,smartphones,799,30,10,true`;

        const blob = new Blob([template], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "product-import-template.csv";
        a.click();
    };

    const columns = [
        { title: "SKU", dataIndex: "SKU" },
        { title: "Name", dataIndex: "Name" },
        { title: "Brand", dataIndex: "Brand" },
        { title: "Model", dataIndex: "Model" },
        { title: "Category", dataIndex: "Category" },
        { title: "Price", dataIndex: "BasePrice" },
        { title: "Stock", dataIndex: "Stock" },
    ];

    return (
        <AdminLayout>
            <Card
                title="Bulk Import Products"
                extra={
                    <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
                        Back
                    </Button>
                }
            >
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                    <Alert
                        message="CSV Format Requirements"
                        description="Your CSV must include these columns: SKU, Name, Brand, Model, Category, BasePrice, Stock, LowStockThreshold, IsActive. Download the template below for reference."
                        type="info"
                        showIcon
                    />

                    <Button icon={<DownloadOutlined />} onClick={downloadTemplate}>
                        Download Template
                    </Button>

                    <Upload
                        accept=".csv"
                        fileList={fileList}
                        onChange={handleFileChange}
                        beforeUpload={() => false}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Select CSV File</Button>
                    </Upload>

                    {previewData.length > 0 && (
                        <>
                            <Alert
                                message={`Preview (showing first ${previewData.length} rows)`}
                                type="success"
                            />
                            <Table
                                dataSource={previewData}
                                columns={columns}
                                pagination={false}
                                size="small"
                            />
                        </>
                    )}

                    {importing && <Progress percent={progress} status="active" />}

                    <Space>
                        <Button
                            type="primary"
                            onClick={handleImport}
                            loading={importing}
                            disabled={fileList.length === 0}
                        >
                            Import Products
                        </Button>
                        <Button onClick={() => router.back()}>Cancel</Button>
                    </Space>
                </Space>
            </Card>
        </AdminLayout>
    );
}
