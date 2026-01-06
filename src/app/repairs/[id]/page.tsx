"use client";

import AdminLayout from "@/components/AdminLayout";
import { getRepair, updateRepair } from "@/lib/api";
import type { RepairTicket } from "@/lib/types";
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
    InputNumber,
    message,
    Spin,
    Timeline,
    Image,
} from "antd";
import {
    ArrowLeftOutlined,
    EditOutlined,
    MailOutlined,
} from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const { TextArea } = Input;

export default function RepairTicketDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const [ticket, setTicket] = useState<RepairTicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState<"status" | "assignment" | "costs" | "notes" | null>(null);
    const [form] = Form.useForm();

    const loadTicket = async () => {
        try {
            const data = await getRepair(params.id as string) as RepairTicket;
            setTicket(data);
        } catch (error) {
            message.error("Failed to load ticket");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTicket();
    }, [params.id]);

    const handleUpdate = async (values: any) => {
        try {
            await updateRepair(params.id as string, values);
            message.success("Ticket updated");
            setModalType(null);
            loadTicket();
        } catch (error) {
            message.error("Failed to update ticket");
        }
    };

    const openModal = (type: typeof modalType) => {
        setModalType(type);
        form.resetFields();
        if (ticket) {
            if (type === "status") {
                form.setFieldsValue({ status: ticket.status, priority: ticket.priority });
            } else if (type === "assignment") {
                form.setFieldsValue(ticket.assignment);
            } else if (type === "costs") {
                form.setFieldsValue(ticket.costs);
            } else if (type === "notes") {
                form.setFieldsValue(ticket.notes);
            }
        }
    };

    if (loading || !ticket) {
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
                title={`Repair Ticket ${ticket.ticketNumber}`}
                extra={
                    <Space>
                        <Button onClick={() => openModal("status")}>Update Status</Button>
                        <Button onClick={() => openModal("assignment")}>Assign</Button>
                        <Button onClick={() => openModal("costs")}>Update Costs</Button>
                        <Button onClick={() => openModal("notes")}>Add Notes</Button>
                        <Button icon={<MailOutlined />}>Email Customer</Button>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
                            Back
                        </Button>
                    </Space>
                }
            >
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                    <Descriptions title="Ticket Info" bordered column={2}>
                        <Descriptions.Item label="Ticket#">{ticket.ticketNumber}</Descriptions.Item>
                        <Descriptions.Item label="Date">
                            {dayjs(ticket.createdAt).format("MMM DD, YYYY HH:mm")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Tag color={ticket.status === "completed" ? "green" : "blue"}>
                                {ticket.status.toUpperCase().replace(/_/g, " ")}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Priority">
                            <Tag color={ticket.priority === "urgent" ? "red" : "orange"}>
                                {ticket.priority.toUpperCase()}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions title="Customer" bordered column={2}>
                        <Descriptions.Item label="Name">{ticket.customerName}</Descriptions.Item>
                        <Descriptions.Item label="Email">{ticket.customerEmail}</Descriptions.Item>
                        <Descriptions.Item label="Phone">{ticket.customerPhone || "N/A"}</Descriptions.Item>
                    </Descriptions>

                    <Descriptions title="Device" bordered column={2}>
                        <Descriptions.Item label="Brand">{ticket.device.brand}</Descriptions.Item>
                        <Descriptions.Item label="Model">{ticket.device.model}</Descriptions.Item>
                        <Descriptions.Item label="IMEI">{ticket.device.imei || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Serial">{ticket.device.serial || "N/A"}</Descriptions.Item>
                    </Descriptions>

                    {ticket.device.images && ticket.device.images.length > 0 && (
                        <div>
                            <h3>Device Images</h3>
                            <Space wrap>
                                {ticket.device.images.map((img, idx) => (
                                    <Image key={idx} src={img} width={150} height={150} />
                                ))}
                            </Space>
                        </div>
                    )}

                    <Descriptions title="Issue" bordered column={1}>
                        <Descriptions.Item label="Category">{ticket.issue.category}</Descriptions.Item>
                        <Descriptions.Item label="Description">
                            {ticket.issue.description}
                        </Descriptions.Item>
                    </Descriptions>

                    {ticket.assignment && (
                        <Descriptions title="Assignment" bordered column={2}>
                            <Descriptions.Item label="Store">
                                {ticket.assignment.store || "Not assigned"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Technician">
                                {ticket.assignment.technician || "Not assigned"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Appointment">
                                {ticket.assignment.appointment || "Not scheduled"}
                            </Descriptions.Item>
                        </Descriptions>
                    )}

                    {ticket.costs && (
                        <Descriptions title="Costs" bordered column={2}>
                            <Descriptions.Item label="Estimated">
                                {ticket.costs.estimated ? `$${ticket.costs.estimated.toFixed(2)}` : "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Actual">
                                {ticket.costs.actual ? `$${ticket.costs.actual.toFixed(2)}` : "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Parts">
                                {ticket.costs.parts ? `$${ticket.costs.parts.toFixed(2)}` : "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Labor">
                                {ticket.costs.labor ? `$${ticket.costs.labor.toFixed(2)}` : "N/A"}
                            </Descriptions.Item>
                        </Descriptions>
                    )}

                    {ticket.notes && (
                        <>
                            {ticket.notes.customer && (
                                <div>
                                    <h3>Customer Notes</h3>
                                    <p style={{ padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
                                        {ticket.notes.customer}
                                    </p>
                                </div>
                            )}
                            {ticket.notes.technician && (
                                <div>
                                    <h3>Technician Notes</h3>
                                    <p style={{ padding: 12, background: "#e6f7ff", borderRadius: 4 }}>
                                        {ticket.notes.technician}
                                    </p>
                                </div>
                            )}
                            {ticket.notes.internal && (
                                <div>
                                    <h3>Internal Notes</h3>
                                    <p style={{ padding: 12, background: "#fff7e6", borderRadius: 4 }}>
                                        {ticket.notes.internal}
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {ticket.timeline && ticket.timeline.length > 0 && (
                        <div>
                            <h3>Timeline</h3>
                            <Timeline
                                items={ticket.timeline.map((event) => ({
                                    children: (
                                        <>
                                            <p style={{ margin: 0 }}><strong>{event.type}</strong></p>
                                            <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
                                                {event.description}
                                            </p>
                                            <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
                                                {dayjs(event.createdAt).format("MMM DD, YYYY HH:mm")}
                                            </p>
                                        </>
                                    ),
                                }))}
                            />
                        </div>
                    )}
                </Space>
            </Card>

            <Modal
                title={
                    modalType === "status" ? "Update Status" :
                    modalType === "assignment" ? "Assign Ticket" :
                    modalType === "costs" ? "Update Costs" :
                    "Add Notes"
                }
                open={modalType !== null}
                onCancel={() => setModalType(null)}
                onOk={() => form.submit()}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                    {modalType === "status" && (
                        <>
                            <Form.Item name="status" label="Status">
                                <Select
                                    options={[
                                        { label: "New", value: "new" },
                                        { label: "In Progress", value: "in_progress" },
                                        { label: "Awaiting Parts", value: "awaiting_parts" },
                                        { label: "Completed", value: "completed" },
                                        { label: "Cancelled", value: "cancelled" },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item name="priority" label="Priority">
                                <Select
                                    options={[
                                        { label: "Low", value: "low" },
                                        { label: "Medium", value: "medium" },
                                        { label: "High", value: "high" },
                                        { label: "Urgent", value: "urgent" },
                                    ]}
                                />
                            </Form.Item>
                        </>
                    )}

                    {modalType === "assignment" && (
                        <>
                            <Form.Item name="store" label="Store">
                                <Select
                                    options={[
                                        { label: "Downtown", value: "downtown" },
                                        { label: "Mall", value: "mall" },
                                        { label: "Airport", value: "airport" },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item name="technician" label="Technician">
                                <Input placeholder="Technician name" />
                            </Form.Item>
                            <Form.Item name="appointment" label="Appointment">
                                <Input placeholder="Appointment date/time" />
                            </Form.Item>
                        </>
                    )}

                    {modalType === "costs" && (
                        <>
                            <Form.Item name="estimated" label="Estimated Cost">
                                <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name="actual" label="Actual Cost">
                                <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name="parts" label="Parts Cost">
                                <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name="labor" label="Labor Cost">
                                <InputNumber min={0} prefix="$" style={{ width: "100%" }} />
                            </Form.Item>
                        </>
                    )}

                    {modalType === "notes" && (
                        <>
                            <Form.Item name="customer" label="Customer Notes">
                                <TextArea rows={3} />
                            </Form.Item>
                            <Form.Item name="technician" label="Technician Notes">
                                <TextArea rows={3} />
                            </Form.Item>
                            <Form.Item name="internal" label="Internal Notes">
                                <TextArea rows={3} />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
        </AdminLayout>
    );
}
