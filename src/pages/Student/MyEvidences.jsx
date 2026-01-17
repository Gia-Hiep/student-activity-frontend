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
        const fullUrl = url.startsWith("http") ? url : `${backendBase}${url}`;

        return (
          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
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

  const statusLabel =
    statusFilter === "pending"
      ? "Chờ duyệt"
      : statusFilter === "approved"
      ? "Đã duyệt"
      : "Tất cả";

  const badgeClass =
    statusFilter === "pending"
      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
      : statusFilter === "approved"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
      : "bg-slate-100 text-slate-700 ring-1 ring-slate-200";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Minh chứng của tôi{" "}
                {statusFilter === "pending" && " (Chờ duyệt)"}
                {statusFilter === "approved" && " (Đã duyệt)"}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Danh sách minh chứng bạn đã nộp. Nhấn “Xem file” để mở minh chứng.
              </p>
            </div>

            <div className="shrink-0">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                Bộ lọc: {statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-base font-semibold text-slate-900">
              Danh sách minh chứng
            </div>
            <div className="text-xs text-slate-500">
              Tổng:{" "}
              <span className="font-semibold text-slate-700">{data.length}</span>
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
