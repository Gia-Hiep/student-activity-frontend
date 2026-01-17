import { Table, Button, Tag } from "antd";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

export default function DeployFacultyActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/activities/faculty");
      setActivities(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách hoạt động KhAoa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeploy = async (record) => {
    try {
      await api.post(`/activities/deploy-to-class/${record.id}`);
      toast.success("Đã triển khai hoạt động về lớp của bạn");
    } catch (err) {
      console.error("Deploy error:", err);

      const res = err.response;
      let backendMessage = "Không thể triển khai hoạt động";

      if (res) {
        if (typeof res.data === "string") backendMessage = res.data;
        else if (res.data?.message) backendMessage = res.data.message;
        else if (res.data?.error) backendMessage = res.data.error;
        else if (Array.isArray(res.data) && res.data.length > 0)
          backendMessage = res.data[0];
      }

      toast.error(backendMessage);
    }
  };

  const columns = [
    {
      title: "Tên hoạt động",
      dataIndex: "tenHd",
      width: 260,
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
      width: 100,
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
      title: "",
      width: 180,
      render: (_, record) => (
        <Button type="primary" onClick={() => handleDeploy(record)}>
          Triển khai cho lớp tôi
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
            Nhận hoạt động từ Khoa
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Cán sự lớp / Liên chi hội chọn hoạt động Khoa để triển khai cho lớp
            mình.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Tổng hoạt động:{" "}
          <span className="font-semibold text-slate-700">
            {activities?.length || 0}
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <Table
          dataSource={activities}
          columns={columns}
          rowKey="id"
          loading={loading}
        />
      </div>
    </div>
  );
}
