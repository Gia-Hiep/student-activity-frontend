import { Table, Tag } from "antd";
import api from "../../api/api";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Lấy baseURL backend từ config axios
const backendBase =
  api.defaults.baseURL?.replace(/\/api\/?$/, "") || "http://localhost:8080";

export default function MyEvidences() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get("status"); // pending | approved | null

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/evidences/my");
      const all = res.data || [];

      let filtered = all;
      if (statusFilter === "pending") {
        filtered = all.filter((d) => d.trangThaiDuyet === "Chờ duyệt");
      } else if (statusFilter === "approved") {
        filtered = all.filter((d) => d.trangThaiDuyet === "Đã duyệt");
      }

      setData(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]); // đổi filter thì load lại

  const columns = [
    { title: "Hoạt động", dataIndex: ["hoatDong", "tenHd"] },
    {
      title: "File",
      dataIndex: "fileUrl",
      render: (url) => {
        if (!url) return "N/A";

        // Nếu backend đã trả sẵn full URL thì dùng luôn
        // Còn nếu chỉ /uploads/xxx.jpg thì tự nối với backendBase
        const fullUrl = url.startsWith("http")
          ? url
          : `${backendBase}${url}`;

        return (
          <a href={fullUrl} target="_blank" rel="noreferrer">
            Xem file
          </a>
        );
      },
    },
    { title: "Ghi chú", dataIndex: "ghiChu" },
    {
      title: "Trạng thái duyệt",
      dataIndex: "trangThaiDuyet",
      render: (st) => {
        let color = "default";
        if (st === "Đã duyệt") color = "green";
        else if (st === "Bị từ chối") color = "red";
        else if (st === "Chờ duyệt") color = "orange";
        return <Tag color={color}>{st}</Tag>;
      },
    },
    {
      title: "Ngày duyệt",
      dataIndex: "ngayDuyet",
      render: (d) => (d ? new Date(d).toLocaleString() : "Chưa duyệt"),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Minh chứng của tôi
        {statusFilter === "pending" && " (Chờ duyệt)"}
        {statusFilter === "approved" && " (Đã duyệt)"}
      </h2>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
}
