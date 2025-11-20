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
    <div className="space-y-8">
      <Card title="Tiêu chí điểm rèn luyện">
        <Table
          dataSource={criteria}
          columns={criteriaColumns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Card title="Quy tắc quy đổi điểm">
        <Table
          dataSource={rules}
          columns={ruleColumns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}
