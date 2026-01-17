import { Table, Button, Modal, Input, message, QRCode } from "antd";
import { useState, useEffect } from "react";
import api from "../../api/api";
import { ScanOutlined } from "@ant-design/icons";

export default function AttendanceManagement() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [qrModal, setQrModal] = useState(false);
  const [manualMssv, setManualMssv] = useState("");

  useEffect(() => {
    api.get("/activities").then((res) => setActivities(res.data));
  }, []);

  const handleManualCheckIn = async () => {
    if (!selectedActivity) return;
    try {
      await api.post("/attendance/check-in", { hoatDongId: selectedActivity.id });
      message.success(`Điểm danh thành công cho MSSV: ${manualMssv}`);
      setManualMssv("");
    } catch (err) {
      message.error("Lỗi điểm danh");
    }
  };

  const columns = [
    { title: "Tên hoạt động", dataIndex: "tenHd", width: 300 },
    {
      title: "Thời gian",
      render: (_, r) => new Date(r.thoiGianBd).toLocaleString(),
    },
    { title: "Địa điểm", dataIndex: "diaDiem" },
    {
      title: "",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<ScanOutlined />}
          onClick={() => {
            setSelectedActivity(record);
            setQrModal(true);
          }}
        >
          Mở QR
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
            Điểm danh hoạt động
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Chọn hoạt động để mở QR điểm danh hoặc điểm danh thủ công theo MSSV.
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
        <Table dataSource={activities} columns={columns} rowKey="id" />
      </div>

      {/* QR Modal */}
      <Modal
        title={`QR Điểm danh: ${selectedActivity?.tenHd}`}
        open={qrModal}
        onCancel={() => setQrModal(false)}
        width={500}
        footer={null}
      >
        <div className="flex flex-col items-center text-center p-4 space-y-4">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <QRCode
              value={`https://yourdomain.com/checkin?activity=${selectedActivity?.id}`}
              size={256}
            />
          </div>

          <p className="text-sm text-slate-700">
            <strong className="text-slate-900">Mã hoạt động:</strong>{" "}
            {selectedActivity?.id}
          </p>

          <div className="w-full pt-4 border-t border-slate-200 space-y-2">
            <p className="text-sm font-medium text-slate-700">
              Điểm danh thủ công
            </p>

            <Input
              placeholder="Nhập MSSV thủ công"
              value={manualMssv}
              onChange={(e) => setManualMssv(e.target.value)}
            />

            <Button type="primary" block onClick={handleManualCheckIn}>
              Điểm danh thủ công
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
