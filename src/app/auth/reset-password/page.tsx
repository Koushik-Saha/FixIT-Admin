"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, message, Typography, Result } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth";
import type { ResetPasswordRequest } from "@/lib/types/auth";

const { Text, Title } = Typography;

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (!tokenParam) {
            message.error("Invalid or missing reset token");
            router.push("/auth/login");
        } else {
            setToken(tokenParam);
        }
    }, [searchParams, router]);

    const onFinish = async (values: {
        password: string;
        confirmPassword: string;
    }) => {
        if (!token) {
            message.error("Invalid reset token");
            return;
        }

        setLoading(true);
        try {
            await resetPassword({ token, password: values.password });
            setSuccess(true);
            message.success("Password reset successful!");
        } catch (error: any) {
            message.error(error.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Result
                status="success"
                title="Password Reset Successful"
                subTitle="Your password has been reset. You can now login with your new password."
                extra={[
                    <Button
                        type="primary"
                        onClick={() => router.push("/auth/login")}
                        key="login"
                    >
                        Go to Login
                    </Button>,
                ]}
            />
        );
    }

    if (!token) {
        return null; // Will redirect
    }

    return (
        <>
            <Title level={4} style={{ marginBottom: 8 }}>
                Reset Your Password
            </Title>
            <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
                Enter your new password below.
            </Text>

            <Form
                name="reset-password"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                requiredMark={false}
            >
                <Form.Item
                    label="New Password"
                    name="password"
                    rules={[
                        { required: true, message: "Please enter a new password" },
                        {
                            min: 8,
                            message: "Password must be at least 8 characters",
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="At least 8 characters"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                        { required: true, message: "Please confirm your password" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error("Passwords do not match"),
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Confirm your password"
                        size="large"
                    />
                </Form.Item>

                <Form.Item style={{ marginTop: 24 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        block
                    >
                        Reset Password
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
