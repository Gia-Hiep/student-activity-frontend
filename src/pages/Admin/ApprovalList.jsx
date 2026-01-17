// src/pages/Admin/ApprovalList.jsx
import { Table, Button, Image, Modal, Input, Tag, message } from "antd";
import api from "../../api/api";
import { useEffect, useState } from "react";

export default function ApprovalList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejecting, setRejecting] = useState(null); // minh chứng đang từ chối
  const [reason, setReason] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/evidences/pending");
      setData(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách minh chứng chờ duyệt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approve = async (id) => {
    try {
      await api.put(`/evidences/approve/${id}`);
      message.success("Đã duyệt minh chứng");
      setData((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
      message.error("Duyệt minh chứng thất bại");
    }
  };

  const confirmReject = (record) => {
    setRejecting(record);
    setReason("");
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      return message.warning("Nhập lý do từ chối");
    }
    try {
      await api.put(`/evidences/reject/${rejecting.id}`, { lyDo: reason });
      message.success("Đã từ chối minh chứng");
      setData((prev) => prev.filter((x) => x.id !== rejecting.id));
      setRejecting(null);
      setReason("");
    } catch (err) {
      console.error(err);
      message.error("Từ chối minh chứng thất bại");
    }
  };

  const columns = [
    {
      title: "Sinh viên",
      dataIndex: ["sinhVien", "hoTen"],
    },
    {
      title: "MSSV",
      dataIndex: ["sinhVien", "mssv"],
    },
    {
      title: "Hoạt động",
      dataIndex: ["hoatDong", "tenHd"],
    },
    {
      title: "File",
      render: (_, r) => (
        <div className="flex items-center">
          <Image
            width={80}
            className="rounded-lg"
            src={`http://localhost:8080${r.fileUrl}`}
            alt="minh chứng"
          />
        </div>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "ghiChu",
      render: (t) => t || <Tag color="default">Chưa có</Tag>,
    },
    {
      title: "Thao tác",
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <Button type="primary" size="small" onClick={() => approve(r.id)}>
            Duyệt
          </Button>
          <Button danger size="small" onClick={() => confirmReject(r)}>
            Từ chối
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Duyệt minh chứng
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Kiểm tra minh chứng sinh viên gửi và thực hiện duyệt hoặc từ chối.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Tổng chờ duyệt:{" "}
          <span className="font-semibold text-slate-700">{data.length}</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          loading={loading}
        />
      </div>

      {/* Reject Modal */}
      <Modal
        title={`Từ chối minh chứng của ${rejecting?.sinhVien?.hoTen || ""}`}
        open={!!rejecting}
        onOk={handleReject}
        onCancel={() => setRejecting(null)}
        okText="Từ chối"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-700">
            Hoạt động:{" "}
            <strong className="text-slate-900">
              {rejecting?.hoatDong?.tenHd}
            </strong>
          </p>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Lý do từ chối
            </p>

            <Input.TextArea
              rows={4}
              placeholder="Nhập lý do từ chối..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
