"use client";

import AdminLayout from "@/components/AdminLayout";
import HeroSlideForm from "@/components/HeroSlideForm";
import { createHeroSlide } from "@/lib/api";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewHeroSlidePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCreate = async (values: any) => {
        setLoading(true);
        try {
            await createHeroSlide(values);
            message.success("Slide created successfully");
            router.push("/homepage/banners");
        } catch (error: any) {
            message.error(error.message || "Failed to create slide");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <h1>Create New Hero Slide</h1>
            <HeroSlideForm onFinish={handleCreate} loading={loading} />
        </AdminLayout>
    );
}
