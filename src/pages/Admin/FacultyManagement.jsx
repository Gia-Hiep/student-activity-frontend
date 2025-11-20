import { Table, Button, Modal, Form, Input, message } from 'antd';
import { useState, useEffect } from 'react';
import api from '../../api/api';

export default function FacultyManagement() {
  const [faculties, setFaculties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    api.get('/faculties').then(res => setFaculties(res.data));
  }, []);

  const handleSubmit = async (values) => {
    await api.post('/faculties', values);
    message.success('Thêm khoa thành công');
    setIsModalOpen(false);
    api.get('/faculties').then(res => setFaculties(res.data));
  };

  const columns = [
    { title: 'Mã khoa', dataIndex: 'maKhoa' },
    { title: 'Tên khoa', dataIndex: 'tenKhoa' },
    { title: 'Trưởng khoa', dataIndex: 'truongKhoa' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Quản lý Khoa</h2>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm khoa mới</Button>
      
      <Table dataSource={faculties} columns={columns} rowKey="id" style={{ marginTop: 20 }} />

      <Modal title="Thêm khoa mới" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="maKhoa" label="Mã khoa" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tenKhoa" label="Tên khoa" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="truongKhoa" label="Trưởng khoa">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Thêm khoa</Button>
        </Form>
      </Modal>
    </div>
  );
}