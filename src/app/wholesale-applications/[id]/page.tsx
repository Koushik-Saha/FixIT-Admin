"use client";

import AdminLayout from "@/components/AdminLayout";
import { getWholesaleApplication, reviewWholesaleApplication } from "@/lib/api";
import type { WholesaleApplication } from "@/lib/types";
import {
    Card,
    Descriptions,
    Tag,
    Space,
    Button,
    Modal,
    Form,
    Select,
    Input,
    message,
    Spin,
    Timeline,
    Image,
} from "antd";
import {
    ArrowLeftOutlined,
    CheckOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const { TextArea } = Input;

export default function ApplicationReviewPage() {
    const router = useRouter();
    const params = useParams();
    const [application, setApplication] = useState<WholesaleApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"approve" | "reject">("approve");
    const [form] = Form.useForm();

    const loadApplication = async () => {
        try {
            const data = await getWholesaleApplication(params.id as string) as WholesaleApplication;
            setApplication(data);
        } catch (error) {
            message.error("Failed to load application");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplication();
    }, [params.id]);

    const handleApprove = () => {
        setModalType("approve");
        form.resetFields();
        setModalOpen(true);
    };

    const handleReject = () => {
        setModalType("reject");
        form.resetFields();
        setModalOpen(true);
    };

    const handleSubmit = async (values: any) => {
        try {
            await reviewWholesaleApplication(params.id as string, {
                status: modalType === "approve" ? "approved" : "rejected",
                ...values,
            });
            message.success(`Application ${modalType === "approve" ? "approved" : "rejected"}`);
            setModalOpen(false);
            router.push("/wholesale-applications");
        } catch (error) {
            message.error("Failed to review application");
        }
    };

    if (loading || !application) {
        return (
            <AdminLayout>
                <Card>
                    <div style={{ textAlign: "center", padding: 50 }}>
                        <Spin size="large" />
                    </div>
                </Card>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Card
                title="Wholesale Application Review"
                extra={
                    <Space>
                        {application.status === "pending" && (
                            <>
                                <Button type="primary" icon={<CheckOutlined />} onClick={handleApprove}>
                                    Approve
                                </Button>
                                <Button danger icon={<CloseOutlined />} onClick={handleReject}>
                                    Reject
                                </Button>
                            </>
                        )}
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
                            Back
                        </Button>
                    </Space>
                }
            >
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                    <Descriptions title="Business Information" bordered column={2}>
                        <Descriptions.Item label="Business Name">
                            {application.businessInfo.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Business Type">
                            {application.businessInfo.type}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tax ID">
                            {application.businessInfo.taxId || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Website">
                            {application.businessInfo.website || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone">
                            {application.businessInfo.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Tag
                                color={
                                    application.status === "approved"
                                        ? "green"
                                        : application.status === "pending"
                                        ? "gold"
                                        : "red"
                                }
                            >
                                {application.status.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions title="Contact Information" bordered column={2}>
                        <Descriptions.Item label="Contact Name">
                            {application.contact.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {application.contact.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone">
                            {application.contact.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Requested Tier">
                            <Tag color="blue">{application.requestedTier.toUpperCase()}</Tag>
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions title="Address" bordered column={1}>
                        <Descriptions.Item label="Address">
                            {application.address.street}
                            <br />
                            {application.address.city}, {application.address.state} {application.address.zip}
                            <br />
                            {application.address.country}
                        </Descriptions.Item>
                    </Descriptions>

                    {application.documents && application.documents.length > 0 && (
                        <div>
                            <h3>Documents</h3>
                            <Space wrap>
                                {application.documents.map((doc, idx) => (
                                    <Image key={idx} src={doc} width={150} height={150} />
                                ))}
                            </Space>
                        </div>
                    )}

                    <Descriptions title="Application Details" bordered column={2}>
                        <Descriptions.Item label="Applied On">
                            {dayjs(application.createdAt).format("MMM DD, YYYY HH:mm")}
                        </Descriptions.Item>
                        {application.reviewedAt && (
                            <Descriptions.Item label="Reviewed On">
                                {dayjs(application.reviewedAt).format("MMM DD, YYYY HH:mm")}
                            </Descriptions.Item>
                        )}
                        {application.reviewedBy && (
                            <Descriptions.Item label="Reviewed By">
                                {application.reviewedBy}
                            </Descriptions.Item>
                        )}
                    </Descriptions>

                    {application.statusHistory && application.statusHistory.length > 0 && (
                        <div>
                            <h3>Status History</h3>
                            <Timeline
                                items={application.statusHistory.map((event) => ({
                                    children: (
                                        <>
                                            <p style={{ margin: 0 }}>
                                                <strong>{event.status.toUpperCase()}</strong>
                                            </p>
                                            {event.notes && (
                                                <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
                                                    {event.notes}
                                                </p>
                                            )}
                                            <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
                                                {dayjs(event.date).format("MMM DD, YYYY HH:mm")}
                                            </p>
                                        </>
                                    ),
                                }))}
                            />
                        </div>
                    )}

                    {application.adminNotes && (
                        <div>
                            <h3>Admin Notes</h3>
                            <p style={{ padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
                                {application.adminNotes}
                            </p>
                        </div>
                    )}
                </Space>
            </Card>

            <Modal
                title={modalType === "approve" ? "Approve Application" : "Reject Application"}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={() => form.submit()}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    {modalType === "approve" && (
                        <Form.Item
                            name="tier"
                            label="Assign Tier"
                            rules={[{ required: true, message: "Please select a tier" }]}
                        >
                            <Select
                                options={[
                                    { label: "Tier 1", value: "tier1" },
                                    { label: "Tier 2", value: "tier2" },
                                    { label: "Tier 3", value: "tier3" },
                                ]}
                            />
                        </Form.Item>
                    )}
                    <Form.Item
                        name="notes"
                        label={modalType === "approve" ? "Approval Notes" : "Rejection Reason"}
                        rules={[{ required: modalType === "reject" }]}
                    >
                        <TextArea rows={4} placeholder="Add notes..." />
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
}
