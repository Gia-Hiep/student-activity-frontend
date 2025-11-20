import { Form, Input, Button, Table, Tag, Select } from "antd";
import api from "../../api/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function MyComplaints() {
  const [data, setData] = useState([]);
  const [eligibleActivities, setEligibleActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      // Lấy danh sách khiếu nại + danh sách đăng ký của SV
      const [complaintsRes, regsRes] = await Promise.all([
        api.get("/complaints/my"),
        api.get("/registrations/my"),
      ]);

      setData(complaintsRes.data || []);
      const regs = regsRes.data || [];
      const now = new Date();

      // Lọc các hoạt động:
      // - SV đã đăng ký
      // - ĐÃ check-in và check-out
      // - Hoạt động ĐÃ KẾT THÚC
      const map = new Map();

      regs.forEach((r) => {
        const hd = r.hoatDong;
        if (!hd || !hd.thoiGianKt) return;

        const ended = new Date(hd.thoiGianKt) < now;
        const participated = r.daCheckIn && r.daCheckOut;

        if (ended && participated) {
          // tránh trùng hoạt động
          if (!map.has(hd.id)) {
            map.set(hd.id, hd);
          }
        }
      });

      setEligibleActivities(Array.from(map.values()));
    } catch (err) {
      console.error(err);
      toast.error("Không tải được dữ liệu khiếu nại / hoạt động đủ điều kiện");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      await api.post("/complaints", {
        activityId: values.activityId,
        noiDung: values.noiDung,
      });
      toast.success("Gửi khiếu nại thành công");
      await loadData();
    } catch (err) {
      console.error(err);
      const data = err.response?.data;
      let backendMsg = "Gửi khiếu nại thất bại";

      if (typeof data === "string") backendMsg = data;
      else if (data && typeof data === "object") {
        backendMsg = data.message || data.error || backendMsg;
      }

      toast.error(backendMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Hoạt động",
      dataIndex: ["hoatDong", "tenHd"],
    },
    {
      title: "Nội dung khiếu nại",
      dataIndex: "noiDung",
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      render: (st) => {
        let color = "default";
        if (st === "Chờ xử lý") color = "orange";
        else if (st === "Đã xử lý") color = "green";
        else if (st === "Từ chối") color = "red";
        return <Tag color={color}>{st}</Tag>;
      },
    },
    {
      title: "Phản hồi",
      dataIndex: "phanHoi",
      render: (text) => text || "-",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Khiếu nại điểm rèn luyện</h2>

      <p className="mb-4 text-sm text-gray-600">
        Chỉ có thể khiếu nại đối với các hoạt động mà bạn đã đăng ký, tham gia
        đầy đủ (Check-in và Check-out) và đã kết thúc.
      </p>

      <Form layout="vertical" onFinish={onFinish} className="mb-8">
        <Form.Item
          label="Hoạt động"
          name="activityId"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn hoạt động muốn khiếu nại",
            },
          ]}
        >
          <Select
            placeholder={
              eligibleActivities.length
                ? "Chọn hoạt động đủ điều kiện khiếu nại"
                : "Hiện chưa có hoạt động nào đủ điều kiện khiếu nại"
            }
            disabled={eligibleActivities.length === 0}
            options={eligibleActivities.map((hd) => ({
              label: hd.tenHd,
              value: hd.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Nội dung khiếu nại"
          name="noiDung"
          rules={[
            { required: true, message: "Nhập nội dung khiếu nại" },
            { min: 10, message: "Nội dung tối thiểu 10 ký tự" },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Mô tả lý do bạn khiếu nại..." />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          disabled={eligibleActivities.length === 0}
        >
          Gửi khiếu nại
        </Button>
      </Form>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
}
