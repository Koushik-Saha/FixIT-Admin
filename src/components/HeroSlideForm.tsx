"use client";

import { Form, Input, InputNumber, Switch, Button, Space, Divider, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { HeroSlide } from "@/lib/types";

interface HeroSlideFormProps {
    initialValues?: Partial<HeroSlide>;
    onFinish: (values: any) => Promise<void>;
    loading?: boolean;
}

export default function HeroSlideForm({ initialValues, onFinish, loading }: HeroSlideFormProps) {
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        // Transform form values to match API expectations if needed
        const formattedValues = {
            ...values,
            ctaPrimary: {
                text: values.ctaPrimaryText,
                link: values.ctaPrimaryLink
            },
            ctaSecondary: values.ctaSecondaryText ? {
                text: values.ctaSecondaryText,
                link: values.ctaSecondaryLink
            } : undefined
        };
        onFinish(formattedValues);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                isActive: true,
                sortOrder: 0,
                ...initialValues,
                ctaPrimaryText: initialValues?.ctaPrimary?.text,
                ctaPrimaryLink: initialValues?.ctaPrimary?.link,
                ctaSecondaryText: initialValues?.ctaSecondary?.text,
                ctaSecondaryLink: initialValues?.ctaSecondary?.link,
            }}
            onFinish={handleSubmit}
        >
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
                <div>
                    <Card title="Content">
                        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description">
                            <Input.TextArea rows={3} />
                        </Form.Item>

                        <Divider>Call to Action (Primary)</Divider>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <Form.Item name="ctaPrimaryText" label="Button Text">
                                <Input />
                            </Form.Item>
                            <Form.Item name="ctaPrimaryLink" label="Button Link">
                                <Input />
                            </Form.Item>
                        </div>

                        <Divider>Call to Action (Secondary)</Divider>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <Form.Item name="ctaSecondaryText" label="Button Text">
                                <Input />
                            </Form.Item>
                            <Form.Item name="ctaSecondaryLink" label="Button Link">
                                <Input />
                            </Form.Item>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card title="Settings">
                        <Form.Item name="image" label="Image URL" rules={[{ required: true }]}>
                            <Input placeholder="https://..." />
                        </Form.Item>
                        <Form.Item name="badge" label="Badge Text">
                            <Input />
                        </Form.Item>
                        <Form.Item name="badgeColor" label="Badge Color">
                            <Input type="color" style={{ width: 100 }} />
                        </Form.Item>
                        <Form.Item name="sortOrder" label="Sort Order">
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name="isActive" label="Status" valuePropName="checked">
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                    </Card>
                </div>
            </div>

            <Form.Item style={{ marginTop: 24 }}>
            </Button>
        </Form.Item>
        </Form >
    );
}
