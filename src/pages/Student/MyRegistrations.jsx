import { Table, Tag, Button, Space } from "antd";
import api from "../../api/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function MyRegistrations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/registrations/my");
      setData(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách đăng ký");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

 const handleCheckIn = async (hoatDongId, record) => {
  if (record.daCheckIn) {
    return toast.info("Bạn đã check-in rồi");
  }
  try {
    await api.post("/attendance/check-in", { hoatDongId });
    toast.success("Check-in thành công!");

    setData((prev) =>
      prev.map((item) =>
        item.id === record.id ? { ...item, daCheckIn: true } : item
      )
    );
  } catch (err) {
    console.error("Check-in error:", err);

    const backendMsg =
      err.response?.data?.message ||
      (typeof err.response?.data === "string"
        ? err.response.data
        : "") ||
      "Lỗi check-in";

    toast.error(backendMsg);
  }
};

const handleCheckOut = async (hoatDongId, record) => {
  if (!record.daCheckIn) {
    return toast.warning("Bạn chưa check-in!");
  }
  if (record.daCheckOut) {
    return toast.info("Bạn đã check-out rồi");
  }

  try {
    await api.post("/attendance/check-out", { hoatDongId });
    toast.success("Check-out thành công!");

    setData((prev) =>
      prev.map((item) =>
        item.id === record.id ? { ...item, daCheckOut: true } : item
      )
    );
  } catch (err) {
    console.error("Check-out error:", err);

    const backendMsg =
      err.response?.data?.message ||
      (typeof err.response?.data === "string"
        ? err.response.data
        : "") ||
      "Lỗi check-out";

    toast.error(backendMsg);
  }
};

  const columns = [
    {
      title: "Hoạt động",
      dataIndex: ["hoatDong", "tenHd"],
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/activities/${record.hoatDong.id}`)}
        >
          {text}
        </Button>
      ),
    },
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
    {
      title: "Trạng thái hoạt động",
      render: (_, record) => {
        const end = record.hoatDong?.thoiGianKt;
        if (!end) return <Tag>N/A</Tag>;

        const ended = new Date(end) < new Date();
        return ended ? (
          <Tag color="red">Đã kết thúc</Tag>
        ) : (
          <Tag color="green">Chưa kết thúc</Tag>
        );
      },
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => navigate(`/submit-evidence/${record.hoatDong.id}`)}
          >
            Nộp minh chứng
          </Button>

          <Button
            size="small"
            type="default"
            onClick={() => handleCheckIn(record.hoatDong.id, record)}
            disabled={record.daCheckIn}
          >
            {record.daCheckIn ? "Đã check-in" : "Check-in"}
          </Button>

          <Button
            size="small"
            danger
            onClick={() => handleCheckOut(record.hoatDong.id, record)}
            disabled={!record.daCheckIn || record.daCheckOut}
          >
            {record.daCheckOut ? "Đã check-out" : "Check-out"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Hoạt động đã đăng ký</h2>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
}
