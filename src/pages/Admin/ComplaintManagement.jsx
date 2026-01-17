import { Table, Tag, Button, Modal, Input, message } from "antd";
import { useEffect, useState } from "react";
import api from "../../api/api";

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    api.get("/complaints").then((res) => setComplaints(res.data));
  }, []);

  const handleReply = async () => {
    await api.put(`/complaints/${selected.id}/handle`, {
      trangThai: "Đã xử lý",
      phanHoi: reply,
    });

    message.success("Đã xử lý khiếu nại");
    setComplaints(
      complaints.map((c) =>
        c.id === selected.id ? { ...c, trangThai: "Đã xử lý" } : c
      )
    );
    setSelected(null);
  };

  const columns = [
    { title: "MSSV", dataIndex: ["sinhVien", "mssv"] },
    { title: "Họ tên", dataIndex: ["sinhVien", "hoTen"] },

    {
      title: "Hoạt động",
      dataIndex: ["hoatDong", "tenHd"],
      width: 250,
    },

    { title: "Nội dung", dataIndex: "noiDung", width: 300 },
    { title: "Học kỳ", dataIndex: "hocKy" },
    {
      title: "Trạng thái",
      render: (_, r) => (
        <Tag color={r.trangThai === "Đã xử lý" ? "green" : "orange"}>
          {r.trangThai}
        </Tag>
      ),
    },
    {
      title: "",
      render: (_, r) =>
        r.trangThai !== "Đã xử lý" && (
          <Button onClick={() => setSelected(r)}>Xử lý</Button>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Xử lý khiếu nại điểm rèn luyện
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Xem danh sách khiếu nại và phản hồi cho sinh viên.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Tổng khiếu nại:{" "}
          <span className="font-semibold text-slate-700">
            {complaints?.length || 0}
          </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <Table dataSource={complaints} columns={columns} rowKey="id" />
      </div>

      {/* Modal phản hồi */}
      <Modal
        title="Phản hồi khiếu nại"
        open={!!selected}
        onCancel={() => setSelected(null)}
        onOk={handleReply}
      >
        <div className="space-y-3">
          <div className="text-sm text-slate-700">
            <p>
              <strong className="text-slate-900">Nội dung khiếu nại:</strong>{" "}
              {selected?.noiDung}
            </p>

            {selected?.hoatDong && (
              <p className="mt-1">
                <strong className="text-slate-900">Hoạt động:</strong>{" "}
                {selected.hoatDong.tenHd}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Phản hồi
            </p>
            <Input.TextArea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Nhập phản hồi..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
