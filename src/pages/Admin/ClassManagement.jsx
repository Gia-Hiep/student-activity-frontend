import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { useState, useEffect } from "react";
import api from "../../api/api";

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [cRes, fRes] = await Promise.all([
      api.get("/classes"),
      api.get("/faculties"),
    ]);
    setClasses(cRes.data);
    setFaculties(fRes.data);
  };

  const handleSubmit = async (values) => {
    await api.post("/classes", values);
    message.success("Thêm lớp thành công");
    setIsModalOpen(false);
    loadData();
  };

  const columns = [
    { title: "Mã lớp", dataIndex: "maLop" },
    { title: "Tên lớp", dataIndex: "tenLop" },
    { title: "Khoa", render: (_, r) => r.khoa?.tenKhoa },
    { title: "Cố vấn", dataIndex: "coVan" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Quản lý Lớp học
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Thêm lớp mới và xem danh sách lớp theo khoa.
          </p>
        </div>

        <div className="shrink-0">
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Thêm lớp mới
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <Table dataSource={classes} columns={columns} rowKey="id" />
      </div>

      {/* Modal */}
      <Modal
        title="Thêm lớp mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="space-y-3">
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item name="maLop" label="Mã lớp" rules={[{ required: true }]}>
              <Input placeholder="VD: D22CQCN01-N" />
            </Form.Item>

            <Form.Item
              name="tenLop"
              label="Tên lớp"
              rules={[{ required: true }]}
            >
              <Input placeholder="VD: Công nghệ thông tin 1" />
            </Form.Item>

            <Form.Item name="khoaId" label="Khoa" rules={[{ required: true }]}>
              <Select placeholder="Chọn khoa">
                {faculties.map((f) => (
                  <Select.Option key={f.id} value={f.id}>
                    {f.tenKhoa}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="coVan" label="Cố vấn học tập">
              <Input placeholder="Nhập tên cố vấn..." />
            </Form.Item>

            <div className="pt-2">
              <Button type="primary" htmlType="submit" block>
                Thêm lớp
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
