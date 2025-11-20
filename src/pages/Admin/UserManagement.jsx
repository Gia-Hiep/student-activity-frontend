import { Table, Tag, Button, Modal, Form, Select, DatePicker, message } from 'antd';
import { useState, useEffect } from 'react';
import api from '../../api/api';

const { RangePicker } = DatePicker;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadClasses();
    loadRoles();
  }, []);

  const loadClasses = async () => {
    const res = await api.get('/classes');
    setClasses(res.data);
  };

  const loadRoles = async () => {
    // Giả lập danh sách vai trò
    setRoles([
      { id: 1, tenVaiTro: 'Cán sự lớp' },
      { id: 2, tenVaiTro: 'Cán bộ khoa' },
      { id: 3, tenVaiTro: 'Liên chi hội' },
    ]);
  };

  const loadUsersByClass = async (lopId) => {
    const res = await api.get(`/users/by-class/${lopId}`);
    setUsers(res.data);
  };

  const handleAssignRole = async (values) => {
    await api.post(`/users/${selectedUser.id}/roles`, {
      vaiTroId: values.vaiTroId,
      hocKy: values.period[0].format('YYYY-YYYY'),
      namHoc: values.period[0].format('YYYY') + '-' + values.period[1].format('YYYY'),
      ngayBatDau: values.date[0].format('YYYY-MM-DD'),
      ngayKetThuc: values.date[1].format('YYYY-MM-DD'),
    });
    message.success('Gán vai trò thành công!');
    setIsModalOpen(false);
  };

  const columns = [
    { title: 'MSSV', dataIndex: 'mssv' },
    { title: 'Họ tên', dataIndex: 'hoTen' },
    { title: 'Lớp', dataIndex: ['lop', 'tenLop'] },
    {
      title: 'Vai trò hiện tại',
      render: (_, record) => (
        <div>
          {record.phanQuyens?.map(pq => (
            <Tag color="blue" key={pq.id}>
              {pq.vaiTro.tenVaiTro} ({pq.hocKy})
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '',
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => {
          setSelectedUser(record);
          setIsModalOpen(true);
        }}>
          Gán vai trò
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý người dùng & phân quyền</h2>
      <Select
        placeholder="Chọn lớp để xem danh sách"
        style={{ width: 300, marginBottom: 20 }}
        onChange={loadUsersByClass}
      >
        {classes.map(c => <Select.Option key={c.id} value={c.id}>{c.tenLop}</Select.Option>)}
      </Select>

      <Table dataSource={users} columns={columns} rowKey="id" />

      <Modal title="Gán vai trò" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} onFinish={handleAssignRole}>
          <Form.Item name="vaiTroId" label="Vai trò" rules={[{ required: true }]}>
            <Select>
              {roles.map(r => <Select.Option key={r.id} value={r.id}>{r.tenVaiTro}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="period" label="Học kỳ">
            <RangePicker picker="year" />
          </Form.Item>
          <Form.Item name="date" label="Thời hạn">
            <RangePicker />
          </Form.Item>
          <Button type="primary" htmlType="submit">Gán vai trò</Button>
        </Form>
      </Modal>
    </div>
  );
}