import type { Metadata } from "next";
import "./globals.css";
import "antd/dist/reset.css";

export const metadata: Metadata = {
    title: "FixIt Admin Panel",
    description: "Admin portal for FixIt: products, orders, repairs, wholesale & inventory.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}
