"use client";

import AdminLayout from "@/components/AdminLayout";
import { Card, Form, Input, InputNumber, Button, Space, Divider, message, Tabs } from "antd";

const { TextArea } = Input;

export default function SettingsPage() {
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        message.success("Settings saved");
    };

    return (
        <AdminLayout>
            <Card title="Settings">
                <Tabs
                    items={[
                        {
                            key: "general",
                            label: "General",
                            children: (
                                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                                    <Divider orientation="left">Company Info</Divider>
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

                                    <Divider orientation="left">Tax Settings</Divider>
                                    <Form.Item name="defaultTaxRate" label="Default Tax Rate (%)">
                                        <InputNumber min={0} max={100} style={{ width: "100%" }} />
                                    </Form.Item>

                                    <Divider orientation="left">Email Settings</Divider>
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
                                            <Button type="primary" htmlType="submit">Save Settings</Button>
                                        </Space>
                                    </Form.Item>
                                </Form>
                            ),
                        },
                        {
                            key: "payment",
                            label: "Payment",
                            children: (
                                <Form layout="vertical" onFinish={handleSubmit}>
                                    <Divider orientation="left">Stripe Settings</Divider>
                                    <Form.Item name="stripePublishableKey" label="Publishable Key">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="stripeSecretKey" label="Secret Key">
                                        <Input.Password />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">Save Settings</Button>
                                    </Form.Item>
                                </Form>
                            ),
                        },
                        {
                            key: "shipping",
                            label: "Shipping",
                            children: (
                                <Form layout="vertical" onFinish={handleSubmit}>
                                    <Divider orientation="left">Shipping Methods</Divider>
                                    <Form.Item name="freeShippingThreshold" label="Free Shipping Threshold">
                                        <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                                    </Form.Item>
                                    <Form.Item name="flatRate" label="Flat Rate Shipping">
                                        <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">Save Settings</Button>
                                    </Form.Item>
                                </Form>
                            ),
                        },
                    ]}
                />
            </Card>
        </AdminLayout>
    );
}
