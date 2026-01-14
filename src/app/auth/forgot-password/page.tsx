"use client";

import { useState } from "react";
import { Form, Input, Button, message, Typography, Result } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/auth";
import type { ForgotPasswordRequest } from "@/lib/types/auth";

const { Text, Title } = Typography;

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const router = useRouter();

    const onFinish = async (values: ForgotPasswordRequest) => {
        setLoading(true);
        try {
            await forgotPassword(values);
            setEmail(values.email);
            setEmailSent(true);
            message.success("Password reset email sent!");
        } catch (error: any) {
            message.error(error.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <Result
                status="success"
                title="Check Your Email"
                subTitle={
                    <>
                        We've sent password reset instructions to{" "}
                        <strong>{email}</strong>.
                        <br />
                        Please check your inbox and follow the link to reset your
                        password.
                    </>
                }
                extra={[
                    <Button
                        type="primary"
                        onClick={() => router.push("/auth/login")}
                        key="login"
                    >
                        Back to Login
                    </Button>,
                    <Button onClick={() => setEmailSent(false)} key="resend">
                        Send Again
                    </Button>,
                ]}
            />
        );
    }

    return (
        <>
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push("/auth/login")}
                style={{ padding: 0, marginBottom: 16 }}
            >
                Back to Login
            </Button>

            <Title level={4} style={{ marginBottom: 8 }}>
                Forgot Password?
            </Title>
            <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
                Enter your email and we'll send you instructions to reset your
                password.
            </Text>

            <Form
                name="forgot-password"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                requiredMark={false}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Please enter a valid email" },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="admin@fixit.com"
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        block
                    >
                        Send Reset Link
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
