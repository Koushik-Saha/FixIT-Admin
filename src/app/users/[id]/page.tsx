"use client";

import AdminLayout from "@/components/AdminLayout";
import { getUser, updateUser } from "@/lib/api";
import {
    Button,
    Card,
    Form,
    Input,
    message,
    Select,
    Spin,
    Tag
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [initialValues, setInitialValues] = useState<any>(null);
    const [form] = Form.useForm();

    // Unwrap params
    const resolvedParams = React.use(params);
    const { id } = resolvedParams;

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await getUser(id);
                setInitialValues(res.data);
                form.setFieldsValue(res.data);
            } catch (error) {
                message.error("Failed to load user");
                router.push("/users");
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [id, router, form]);

    const handleUpdate = async (values: any) => {
        setSaving(true);
        try {
            await updateUser(id, values);
            message.success("User updated successfully");
            router.push("/users");
        } catch (error: any) {
            message.error(error.message || "Failed to update user");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <Spin size="large" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Card
                title={
                    <span>
                        Edit User: {initialValues?.fullName}
                        <Tag
                            color={initialValues?.isBlocked ? "red" : "green"}
                            style={{ marginLeft: 10 }}
                        >
                            {initialValues?.isBlocked ? "BLOCKED" : "ACTIVE"}
                        </Tag>
                    </span>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initialValues}
                    onFinish={handleUpdate}
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="phone" label="Phone">
                        <Input />
                    </Form.Item>

                    <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                        <Select options={[
                            { label: "Customer", value: "CUSTOMER" },
                            { label: "Wholesale", value: "WHOLESALE" },
                            { label: "Admin", value: "ADMIN" },
                        ]} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={saving}>
                            Save Changes
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => router.push("/users")}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </AdminLayout>
    );
}
