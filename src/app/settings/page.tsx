"use client";

import AdminLayout from "@/components/AdminLayout";
import { getSettings, updateSettings } from "@/lib/api";
import { Card, Form, Input, InputNumber, Button, Space, Divider, message, Tabs, Spin } from "antd";
import { useEffect, useState } from "react";

const { TextArea } = Input;

export default function SettingsPage() {
    const [generalForm] = Form.useForm();
    const [paymentForm] = Form.useForm();
    const [shippingForm] = Form.useForm();
    const [loading, setLoading] = useState(true);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const data = await getSettings();
            if (data) {
                generalForm.setFieldsValue(data);
                paymentForm.setFieldsValue(data);
                shippingForm.setFieldsValue(data);
            }
        } catch (error) {
            message.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleSubmit = async (values: any) => {
        try {
            message.loading({ content: "Saving...", key: "save" });
            await updateSettings(values);
            message.success({ content: "Settings saved", key: "save" });
        } catch (error) {
            message.error({ content: "Failed to save settings", key: "save" });
        }
    };

    return (
        <AdminLayout>
            <Card title="Settings">
                {loading ? (
                    <div style={{ textAlign: "center", padding: "50px" }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Tabs
                        items={[
                            {
                                key: "general",
                                label: "General",
                                children: (
                                    <Form form={generalForm} layout="vertical" onFinish={handleSubmit}>
                                        <Divider>Company Info</Divider>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                            <Form.Item name="companyName" label="Company Name">
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="companyEmail" label="Company Email">
                                                <Input type="email" />
                                            </Form.Item>
                                        </div>
                                        <Form.Item name="companyPhone" label="Phone">
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name="companyAddress" label="Address">
                                            <TextArea rows={3} />
                                        </Form.Item>

                                        <Divider>Tax Settings</Divider>
                                        <Form.Item name="defaultTaxRate" label="Default Tax Rate (%)">
                                            <InputNumber min={0} max={100} style={{ width: "100%" }} />
                                        </Form.Item>

                                        <Divider>Email Settings</Divider>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                            <Form.Item name="fromEmail" label="From Email">
                                                <Input type="email" />
                                            </Form.Item>
                                            <Form.Item name="supportEmail" label="Support Email">
                                                <Input type="email" />
                                            </Form.Item>
                                        </div>

                                        <Form.Item>
                                            <Space>
                                                <Button type="primary" htmlType="submit">Save General Settings</Button>
                                            </Space>
                                        </Form.Item>
                                    </Form>
                                ),
                            },
                            {
                                key: "payment",
                                label: "Payment",
                                children: (
                                    <Form form={paymentForm} layout="vertical" onFinish={handleSubmit}>
                                        <Divider>Stripe Settings</Divider>
                                        <Form.Item name="stripePublishableKey" label="Publishable Key">
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name="stripeSecretKey" label="Secret Key">
                                            <Input.Password />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">Save Payment Settings</Button>
                                        </Form.Item>
                                    </Form>
                                ),
                            },
                            {
                                key: "shipping",
                                label: "Shipping",
                                children: (
                                    <Form form={shippingForm} layout="vertical" onFinish={handleSubmit}>
                                        <Divider>Shipping Methods</Divider>
                                        <Form.Item name="freeShippingThreshold" label="Free Shipping Threshold">
                                            <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                                        </Form.Item>
                                        <Form.Item name="flatRate" label="Flat Rate Shipping">
                                            <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">Save Shipping Settings</Button>
                                        </Form.Item>
                                    </Form>
                                ),
                            },
                        ]}
                    />
                )}
            </Card>
        </AdminLayout>
    );
}
