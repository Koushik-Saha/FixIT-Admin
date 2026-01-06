"use client";

import AdminLayout from "@/components/AdminLayout";
import { createCoupon } from "@/lib/api";
import {
    Card,
    Form,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Switch,
    Button,
    Space,
    Divider,
    message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function NewCouponPage() {
    const router = useRouter();
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        try {
            await createCoupon(values);
            message.success("Coupon created");
            router.push("/coupons");
        } catch (error) {
            message.error("Failed to create coupon");
        }
    };

    return (
        <AdminLayout>
            <Card
                title="Create Coupon"
                extra={
                    <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
                        Back
                    </Button>
                }
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: "active", restrictions: { appliesTo: "all", userRestriction: "all" } }}>
                    <Divider orientation="left">Basic Info</Divider>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <Form.Item name="code" label="Code" rules={[{ required: true }]}>
                            <Input placeholder="SUMMER2024" />
                        </Form.Item>
                        <Form.Item name="status" label="Status">
                            <Select options={[{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }]} />
                        </Form.Item>
                    </div>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <TextArea rows={2} />
                    </Form.Item>

                    <Divider orientation="left">Discount</Divider>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                            <Select options={[{ label: "Percentage", value: "percentage" }, { label: "Fixed Amount", value: "fixed" }]} />
                        </Form.Item>
                        <Form.Item name="value" label="Value" rules={[{ required: true }]}>
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                    </div>

                    <Divider orientation="left">Restrictions</Divider>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <Form.Item name={["restrictions", "minPurchase"]} label="Minimum Purchase">
                            <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name={["restrictions", "maxDiscount"]} label="Max Discount (for %)">
                            <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name={["restrictions", "maxUsesTotal"]} label="Max Uses (Total)">
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name={["restrictions", "maxUsesPerUser"]} label="Max Uses (Per User)">
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name={["restrictions", "appliesTo"]} label="Applies To">
                            <Select options={[{ label: "All Products", value: "all" }, { label: "Specific Products", value: "products" }, { label: "Specific Categories", value: "categories" }]} />
                        </Form.Item>
                        <Form.Item name={["restrictions", "userRestriction"]} label="User Restriction">
                            <Select options={[{ label: "All Users", value: "all" }, { label: "New Customers", value: "new" }, { label: "Wholesale Only", value: "wholesale" }, { label: "Retail Only", value: "retail" }]} />
                        </Form.Item>
                    </div>

                    <Divider orientation="left">Dates</Divider>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
                            <Input type="date" />
                        </Form.Item>
                        <Form.Item name="endDate" label="End Date">
                            <Input type="date" />
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">Create Coupon</Button>
                            <Button onClick={() => router.back()}>Cancel</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </AdminLayout>
    );
}
