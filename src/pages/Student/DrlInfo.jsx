import { Table, Card } from "antd";
import api from "../../api/api";
import { useEffect, useState } from "react";

export default function DrlInfo() {
  const [criteria, setCriteria] = useState([]);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    api.get("/drl/criteria").then((res) => setCriteria(res.data || []));
    api.get("/drl/rules").then((res) => setRules(res.data || []));
  }, []);

  const criteriaColumns = [
    { title: "Mã TC", dataIndex: "maTc" },
    { title: "Tên tiêu chí", dataIndex: "tenTieuChi" },
    { title: "Nhóm", dataIndex: "nhom" },
    { title: "Điểm tối đa", dataIndex: "diemToiDa" },
  ];

  const ruleColumns = [
    { title: "Loại hoạt động", dataIndex: ["loaiHoatDong", "tenLoai"] },
    { title: "Tiêu chí", dataIndex: ["tieuChi", "maTc"] },
    { title: "Điểm cộng", dataIndex: "diemCong" },
    { title: "Giới hạn mỗi HK", dataIndex: "gioiHanMoiHk" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Thông tin điểm rèn luyện
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Danh sách tiêu chí và quy tắc quy đổi điểm theo từng loại hoạt động.
          </p>
        </div>

        {/* Tiêu chí */}
        <Card
          title={<span className="font-semibold">Tiêu chí điểm rèn luyện</span>}
          className="rounded-2xl shadow-sm"
        >
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <Table
              dataSource={criteria}
              columns={criteriaColumns}
              rowKey="id"
              pagination={false}
              className="[&_.ant-table-thead>tr>th]:bg-slate-50"
            />
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Gợi ý: dùng bảng này để biết mỗi nhóm tiêu chí có điểm tối đa bao nhiêu.
          </div>
        </Card>

        {/* Quy tắc */}
        <Card
          title={<span className="font-semibold">Quy tắc quy đổi điểm</span>}
          className="rounded-2xl shadow-sm"
        >
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <Table
              dataSource={rules}
              columns={ruleColumns}
              rowKey="id"
              pagination={false}
              className="[&_.ant-table-thead>tr>th]:bg-slate-50"
            />
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Lưu ý: “Giới hạn mỗi HK” là số điểm tối đa được cộng cho cùng một loại trong 1 học kỳ.
          </div>
        </Card>
      </div>
    </div>
  );
}
