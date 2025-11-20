import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Tag,
  Space,
  Drawer,
  Popconfirm,
} from "antd";
import { useEffect, useState } from "react";
import api from "../../api/api";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const { RangePicker } = DatePicker;

export default function ActivityManagement() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null); // null = create, object = edit
  const [form] = Form.useForm();

  const [loaiHoatDongs, setLoaiHoatDongs] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [regList, setRegList] = useState([]);
  const [regLoading, setRegLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const { roles } = useSelector((s) => s.auth);

  const isFacultyRole =
    roles?.includes("ROLE_Cán bộ khoa") || roles?.includes("ROLE_Admin");
  const isClassLeaderRole =
    roles?.includes("ROLE_Cán sự lớp") || roles?.includes("ROLE_Liên chi hội");

  const loadData = async () => {
    try {
      setLoading(true);

      // Khoa/Admin xem hoạt động KHOA – Cán sự/lch xem hoạt động LỚP
      const activitiesEndpoint = isFacultyRole
        ? "/activities/faculty"
        : "/activities/class";

      const [actRes, loaiRes] = await Promise.all([
        api.get(activitiesEndpoint),
        api.get("/activity-types"),
      ]);
      setActivities(actRes.data || []);
      setLoaiHoatDongs(loaiRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách hoạt động");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFacultyRole, isClassLeaderRole]);

  const openCreate = () => {
    if (!isFacultyRole) {
      toast.error("Chỉ Cán bộ khoa / Admin mới được tạo hoạt động Khoa");
      return;
    }
    setEditing(null);
    form.resetFields();
    setOpenModal(true);
  };

  const openEdit = (record) => {
    if (record.trangThai === "Đã kết thúc") {
      toast.warning("Hoạt động đã kết thúc, không thể sửa");
      return;
    }

    setEditing(record);
    form.setFieldsValue({
      tenHd: record.tenHd,
      moTa: record.moTa,
      diaDiem: record.diaDiem,
      gioiHanSv: record.gioiHanSv,
      loaiId: record.loai?.id,
      timeRange: [
        record.thoiGianBd ? dayjs(record.thoiGianBd) : null,
        record.thoiGianKt ? dayjs(record.thoiGianKt) : null,
      ],
    });
    setOpenModal(true);
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        tenHd: values.tenHd,
        moTa: values.moTa,
        diaDiem: values.diaDiem,
        gioiHanSv: values.gioiHanSv,
        loai: values.loaiId ? { id: values.loaiId } : null,
        thoiGianBd: values.timeRange?.[0]?.toISOString() || null,
        thoiGianKt: values.timeRange?.[1]?.toISOString() || null,
      };

      if (editing) {
        // Cả Khoa và Lớp đều được phép chỉnh sửa hoạt động của mình (nếu chưa kết thúc)
        await api.put(`/activities/${editing.id}`, payload);
        toast.success("Cập nhật hoạt động thành công");
      } else {
        // Tạo mới chỉ cho Khoa/Admin
        if (!isFacultyRole) {
          toast.error("Chỉ Cán bộ khoa / Admin mới được tạo hoạt động mới");
          return;
        }
        await api.post("/activities/faculty", payload);
        toast.success("Tạo hoạt động Khoa thành công");
      }

      setOpenModal(false);
      loadData();
    } catch (err) {
      console.error("Lỗi lưu hoạt động:", err);

      const data = err.response?.data;
      let backendMessage = "Lưu hoạt động thất bại";

      if (typeof data === "string") {
        backendMessage = data;
      } else if (Array.isArray(data) && data.length > 0) {
        backendMessage = data[0];
      } else if (data && typeof data === "object") {
        backendMessage = data.message || data.error || backendMessage;
      }

      toast.error(backendMessage);
    }
  };

  const handleDelete = async (record) => {
    try {
      await api.delete(`/activities/${record.id}`);
      toast.success("Đã xoá hoạt động");
      loadData();
    } catch (err) {
      console.error("Lỗi xoá hoạt động:", err);

      const data = err.response?.data;
      let backendMessage = "Không thể xoá hoạt động";

      if (typeof data === "string") {
        backendMessage = data;
      } else if (Array.isArray(data) && data.length > 0) {
        backendMessage = data[0];
      } else if (data && typeof data === "object") {
        backendMessage = data.message || data.error || backendMessage;
      }

      toast.error(backendMessage);
    }
  };

  const openRegistrations = async (record) => {
    setSelectedActivity(record);
    setDrawerOpen(true);
    try {
      setRegLoading(true);
      const res = await api.get(`/registrations/activity/${record.id}`);
      setRegList(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách sinh viên đăng ký");
    } finally {
      setRegLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên hoạt động",
      dataIndex: "tenHd",
      width: 250,
    },
    {
      title: "Loại",
      render: (_, r) => r.loai?.tenLoai || "",
    },
    {
      title: "Thời gian",
      render: (_, r) =>
        r.thoiGianBd && r.thoiGianKt
          ? `${new Date(r.thoiGianBd).toLocaleString()} - ${new Date(
              r.thoiGianKt
            ).toLocaleString()}`
          : "",
    },
    {
      title: "Địa điểm",
      dataIndex: "diaDiem",
    },
    {
      title: "Giới hạn SV",
      dataIndex: "gioiHanSv",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: (t) => (
        <Tag color={t === "Mở" ? "green" : t === "Đã đầy" ? "orange" : "red"}>
          {t}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      width: 260,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => openEdit(record)}
            disabled={record.trangThai === "Đã kết thúc"}
          >
            Sửa
          </Button>

          {/* Xoá chỉ cho Khoa/Admin */}
          {isFacultyRole && (
            <Popconfirm
              title="Xoá hoạt động"
              description={`Bạn chắc chắn muốn xoá "${record.tenHd}"?`}
              okText="Xoá"
              okType="danger"
              cancelText="Hủy"
              onConfirm={() => handleDelete(record)}
            >
              <Button size="small" danger>
                Xoá
              </Button>
            </Popconfirm>
          )}

          <Button
            size="small"
            type="primary"
            onClick={() => openRegistrations(record)}
          >
            SV đã đăng ký
          </Button>
        </Space>
      ),
    },
  ];

  const regColumns = [
    { title: "MSSV", dataIndex: ["sinhVien", "mssv"] },
    { title: "Họ tên", dataIndex: ["sinhVien", "hoTen"] },
    {
      title: "Thời gian đăng ký",
      dataIndex: "thoiDiemDk",
      render: (d) => new Date(d).toLocaleString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThaiDk",
      render: (t) => <Tag color="blue">{t}</Tag>,
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>
        {isFacultyRole ? "Quản lý hoạt động KHOA" : "Quản lý hoạt động LỚP"}
      </h2>

      {/* Nút tạo chỉ cho Khoa/Admin */}
      {isFacultyRole && (
        <Button
          type="primary"
          onClick={openCreate}
          style={{ marginBottom: 16 }}
        >
          Tạo hoạt động Khoa mới
        </Button>
      )}

      <Table
        dataSource={activities}
        columns={columns}
        rowKey="id"
        loading={loading}
      />

      {/* Modal tạo / sửa */}
      <Modal
        title={editing ? "Cập nhật hoạt động" : "Tạo hoạt động mới"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="tenHd"
            label="Tên hoạt động"
            rules={[{ required: true, message: "Nhập tên hoạt động" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="diaDiem" label="Địa điểm">
            <Input />
          </Form.Item>
          <Form.Item name="loaiId" label="Loại hoạt động">
            <Select
              placeholder="Chọn loại hoạt động"
              allowClear
              options={loaiHoatDongs.map((l) => ({
                label: l.tenLoai,
                value: l.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="timeRange" label="Thời gian diễn ra">
            <RangePicker showTime style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="gioiHanSv" label="Giới hạn sinh viên">
            <Input type="number" min={0} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            {editing ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Form>
      </Modal>

      <Drawer
        title={
          selectedActivity
            ? `Sinh viên đăng ký: ${selectedActivity.tenHd}`
            : "Sinh viên đăng ký"
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={600}
      >
        <Table
          dataSource={regList}
          columns={regColumns}
          rowKey="id"
          loading={regLoading}
        />
      </Drawer>
    </div>
  );
}
