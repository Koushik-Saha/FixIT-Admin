"use client";

import AdminLayout from "@/components/AdminLayout";
import HeroSlideForm from "@/components/HeroSlideForm";
import { getHeroSlide, updateHeroSlide } from "@/lib/api";
import { message, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";

export default function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [initialValues, setInitialValues] = useState<any>(null);

    // Unwrap params
    const resolvedParams = React.use(params);
    const { id } = resolvedParams;

    useEffect(() => {
        const loadSlide = async () => {
            try {
                const data = await getHeroSlide(id);
                setInitialValues(data);
            } catch (error) {
                message.error("Failed to load slide");
                router.push("/homepage/banners");
            } finally {
                setLoading(false);
            }
        };
        loadSlide();
    }, [id, router]);

    const handleUpdate = async (values: any) => {
        setSaving(true);
        try {
            await updateHeroSlide(id, values);
            message.success("Slide updated successfully");
            router.push("/homepage/banners");
        } catch (error: any) {
            message.error(error.message || "Failed to update slide");
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
            <h1>Edit Hero Slide</h1>
            <HeroSlideForm initialValues={initialValues} onFinish={handleUpdate} loading={saving} />
        </AdminLayout>
    );
}
