"use client";

import { useState } from "react";
import { Form, Input, Button, message, Typography, Divider } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { register as apiRegister } from "@/lib/auth";
import type { RegisterRequest } from "@/lib/types/auth";

const { Text } = Typography;

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const onFinish = async (values: RegisterRequest) => {
        setLoading(true);
        try {
            const response = await apiRegister(values);
            login(response.user);
            message.success("Registration successful! Welcome to FixIt Admin.");
            router.push("/");
        } catch (error: any) {
            message.error(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form
                name="register"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                requiredMark={false}
            >
                <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter your name" }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="John Doe"
                        size="large"
                    />
                </Form.Item>

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
                        { required: true, message: "Please enter a password" },
                        { min: 8, message: "Password must be at least 8 characters" },
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
                        Create Account
                    </Button>
                </Form.Item>
            </Form>

            <Divider plain>
                <Text type="secondary">Already have an account?</Text>
            </Divider>

            <Button
                type="default"
                size="large"
                block
                onClick={() => router.push("/auth/login")}
            >
                Sign In
            </Button>
        </>
    );
}
