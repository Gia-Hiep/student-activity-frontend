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
    <div>
      <h2 style={{ marginBottom: 24 }}>Quản lý Lớp học</h2>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Thêm lớp mới
      </Button>

      <Table
        dataSource={classes}
        columns={columns}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal
        title="Thêm lớp mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="maLop" label="Mã lớp" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tenLop" label="Tên lớp" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="khoaId" label="Khoa" rules={[{ required: true }]}>
            <Select>
              {faculties.map((f) => (
                <Select.Option key={f.id} value={f.id}>
                  {f.tenKhoa}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="coVan" label="Cố vấn học tập">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm lớp
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
