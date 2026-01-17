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
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Khiếu nại điểm rèn luyện
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Chỉ có thể khiếu nại đối với các hoạt động mà bạn đã đăng ký, tham gia
            đầy đủ (Check-in và Check-out) và đã kết thúc.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              Điều kiện: Đã đăng ký
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              Đã check-in + check-out
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              Hoạt động đã kết thúc
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-base font-semibold text-slate-900">
                Gửi khiếu nại mới
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Vui lòng chọn hoạt động đủ điều kiện và nhập nội dung chi tiết.
              </div>
            </div>

            <div className="shrink-0 text-xs text-slate-500">
              {eligibleActivities.length > 0 ? (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-200">
                  Có {eligibleActivities.length} hoạt động đủ điều kiện
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-rose-700 ring-1 ring-rose-200">
                  Chưa có hoạt động đủ điều kiện
                </span>
              )}
            </div>
          </div>

          <Form layout="vertical" onFinish={onFinish} className="!mb-0">
            <div className="grid grid-cols-1 gap-4">
              <Form.Item
                label={<span className="font-medium">Hoạt động</span>}
                name="activityId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn hoạt động muốn khiếu nại",
                  },
                ]}
              >
                <Select
                  className="w-full"
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
                label={<span className="font-medium">Nội dung khiếu nại</span>}
                name="noiDung"
                rules={[
                  { required: true, message: "Nhập nội dung khiếu nại" },
                  { min: 10, message: "Nội dung tối thiểu 10 ký tự" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Mô tả lý do bạn khiếu nại..."
                  className="rounded-lg"
                />
              </Form.Item>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  disabled={eligibleActivities.length === 0}
                  className="h-10 rounded-lg font-semibold"
                >
                  Gửi khiếu nại
                </Button>
              </div>
            </div>
          </Form>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-base font-semibold text-slate-900">
              Lịch sử khiếu nại
            </div>
            <div className="text-xs text-slate-500">
              Tổng: <span className="font-semibold text-slate-700">{data.length}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <Table
              dataSource={data}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 8 }}
              className="[&_.ant-table-thead>tr>th]:bg-slate-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
