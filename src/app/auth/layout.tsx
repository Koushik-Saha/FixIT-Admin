"use client";

import Image from "next/image";
import { Typography } from "antd";

const { Title, Text } = Typography;

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #020617 0%, #0b1120 50%, #020617 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 450,
                    background: "#fff",
                    borderRadius: 16,
                    padding: 48,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: 32,
                    }}
                >
                    <Image
                        src="/fix_it_logo.png"
                        alt="FixIt Logo"
                        width={64}
                        height={64}
                        style={{ borderRadius: 12 }}
                    />
                    <Title level={2} style={{ marginTop: 16, marginBottom: 8 }}>
                        FixIt Admin
                    </Title>
                    <Text type="secondary">Manage your business from one place</Text>
                </div>
                {children}
            </div>
        </div>
    );
}
