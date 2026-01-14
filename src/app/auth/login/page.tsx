"use client";

import { useState } from "react";
import {
    Form,
    Input,
    Button,
    Checkbox,
    message,
    Typography,
    Divider,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { login as apiLogin } from "@/lib/auth";
import type { LoginRequest } from "@/lib/types/auth";

const { Text } = Typography;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    const onFinish = async (values: LoginRequest) => {
        setLoading(true);
        try {
            const response = await apiLogin(values);
            login(response.user);
            message.success("Login successful!");

            // Redirect to original destination or dashboard
            const redirect = searchParams.get("redirect") || "/";
            router.push(redirect);
        } catch (error: any) {
            message.error(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form
                name="login"
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

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: "Please enter your password" },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Enter your password"
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <Link href="/auth/forgot-password">
                            <Text type="secondary" style={{ fontSize: 14 }}>
                                Forgot password?
                            </Text>
                        </Link>
                    </div>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        block
                    >
                        Sign In
                    </Button>
                </Form.Item>
            </Form>

            <Divider plain>
                <Text type="secondary">Don't have an account?</Text>
            </Divider>

            <Button
                type="default"
                size="large"
                block
                onClick={() => router.push("/auth/register")}
            >
                Create Account
            </Button>
        </>
    );
}
