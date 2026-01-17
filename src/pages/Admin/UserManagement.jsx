import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
} from "antd";
import { useState, useEffect } from "react";
import api from "../../api/api";

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
    const res = await api.get("/classes");
    setClasses(res.data);
  };

  const loadRoles = async () => {
    // Giả lập danh sách vai trò
    setRoles([
      { id: 1, tenVaiTro: "Cán sự lớp" },
      { id: 2, tenVaiTro: "Cán bộ khoa" },
      { id: 3, tenVaiTro: "Liên chi hội" },
    ]);
  };

  const loadUsersByClass = async (lopId) => {
    const res = await api.get(`/users/by-class/${lopId}`);
    setUsers(res.data);
  };

  const handleAssignRole = async (values) => {
    await api.post(`/users/${selectedUser.id}/roles`, {
      vaiTroId: values.vaiTroId,
      hocKy: values.period[0].format("YYYY-YYYY"),
      namHoc:
        values.period[0].format("YYYY") +
        "-" +
        values.period[1].format("YYYY"),
      ngayBatDau: values.date[0].format("YYYY-MM-DD"),
      ngayKetThuc: values.date[1].format("YYYY-MM-DD"),
    });
    message.success("Gán vai trò thành công!");
    setIsModalOpen(false);
  };

  const columns = [
    { title: "MSSV", dataIndex: "mssv" },
    { title: "Họ tên", dataIndex: "hoTen" },
    { title: "Lớp", dataIndex: ["lop", "tenLop"] },
    {
      title: "Vai trò hiện tại",
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          {record.phanQuyens?.map((pq) => (
            <Tag color="blue" key={pq.id}>
              {pq.vaiTro.tenVaiTro} ({pq.hocKy})
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setSelectedUser(record);
            setIsModalOpen(true);
          }}
        >
          Gán vai trò
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Quản lý người dùng & phân quyền
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Chọn lớp để xem danh sách sinh viên và gán vai trò theo học kỳ.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Tổng người dùng:{" "}
          <span className="font-semibold text-slate-700">
            {users?.length || 0}
          </span>
        </div>
      </div>

      {/* Filter + Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="text-sm font-medium text-slate-700">
            Lọc theo lớp
          </div>

          <Select
            placeholder="Chọn lớp để xem danh sách"
            className="w-full md:w-[320px]"
            onChange={loadUsersByClass}
          >
            {classes.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.tenLop}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Table dataSource={users} columns={columns} rowKey="id" />
      </div>

      {/* Modal */}
      <Modal
        title="Gán vai trò"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="space-y-3">
          <div className="text-sm text-slate-600">
            {selectedUser ? (
              <>
                Gán vai trò cho:{" "}
                <span className="font-semibold text-slate-800">
                  {selectedUser.hoTen}
                </span>{" "}
                ({selectedUser.mssv})
              </>
            ) : null}
          </div>

          <Form form={form} onFinish={handleAssignRole} layout="vertical">
            <Form.Item
              name="vaiTroId"
              label="Vai trò"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn vai trò">
                {roles.map((r) => (
                  <Select.Option key={r.id} value={r.id}>
                    {r.tenVaiTro}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="period" label="Học kỳ">
              <RangePicker picker="year" className="w-full" />
            </Form.Item>

            <Form.Item name="date" label="Thời hạn">
              <RangePicker className="w-full" />
            </Form.Item>

            <div className="pt-2">
              <Button type="primary" htmlType="submit" block>
                Gán vai trò
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
