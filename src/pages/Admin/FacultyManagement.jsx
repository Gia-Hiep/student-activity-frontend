import { Table, Button, Modal, Form, Input, message } from "antd";
import { useState, useEffect } from "react";
import api from "../../api/api";

export default function FacultyManagement() {
  const [faculties, setFaculties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    api.get("/faculties").then((res) => setFaculties(res.data));
  }, []);

  const handleSubmit = async (values) => {
    await api.post("/faculties", values);
    message.success("Thêm khoa thành công");
    setIsModalOpen(false);
    api.get("/faculties").then((res) => setFaculties(res.data));
  };

  const columns = [
    { title: "Mã khoa", dataIndex: "maKhoa" },
    { title: "Tên khoa", dataIndex: "tenKhoa" },
    { title: "Trưởng khoa", dataIndex: "truongKhoa" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Quản lý Khoa</h2>
          <p className="text-sm text-slate-500 mt-1">
            Thêm khoa mới và xem danh sách khoa trong hệ thống.
          </p>
        </div>

        <div className="shrink-0">
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Thêm khoa mới
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <Table dataSource={faculties} columns={columns} rowKey="id" />
      </div>

      {/* Modal */}
      <Modal
        title="Thêm khoa mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="space-y-3">
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item name="maKhoa" label="Mã khoa" rules={[{ required: true }]}>
              <Input placeholder="VD: CNTT" />
            </Form.Item>

            <Form.Item
              name="tenKhoa"
              label="Tên khoa"
              rules={[{ required: true }]}
            >
              <Input placeholder="VD: Công nghệ thông tin" />
            </Form.Item>

            <Form.Item name="truongKhoa" label="Trưởng khoa">
              <Input placeholder="Nhập tên trưởng khoa..." />
            </Form.Item>

            <div className="pt-2">
              <Button type="primary" htmlType="submit" block>
                Thêm khoa
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
