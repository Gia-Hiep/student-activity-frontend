import { Table, Card, Select, Row, Col } from "antd";
import api from "../../api/api";
import { useEffect, useState } from "react";

export default function FacultyClassBrowser() {
  const [faculties, setFaculties] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedKhoa, setSelectedKhoa] = useState(null);

  useEffect(() => {
    api.get("/faculties").then((res) => setFaculties(res.data || []));
  }, []);

  useEffect(() => {
    api
      .get("/classes", {
        params: selectedKhoa ? { khoaId: selectedKhoa } : {},
      })
      .then((res) => setClasses(res.data || []));
  }, [selectedKhoa]);

  const classColumns = [
    { title: "Tên lớp", dataIndex: "tenLop" },
    { title: "Cố vấn", dataIndex: "coVan" },
    { title: "Khoa", dataIndex: ["khoa", "tenKhoa"] },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Tra cứu khoa & lớp
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chọn khoa để lọc danh sách lớp tương ứng.
          </p>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card
              title={<span className="font-semibold">Danh sách khoa</span>}
              className="rounded-2xl shadow-sm"
            >
              <div className="space-y-3">
                <div className="text-sm text-slate-600">
                  Bộ lọc theo khoa
                </div>

                <Select
                  className="w-full"
                  placeholder="Chọn khoa để xem lớp"
                  value={selectedKhoa}
                  onChange={setSelectedKhoa}
                  options={faculties.map((f) => ({
                    label: f.tenKhoa,
                    value: f.id,
                  }))}
                />

                <div className="text-xs text-slate-500">
                  Không chọn khoa sẽ hiển thị tất cả lớp.
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card
              title={<span className="font-semibold">Danh sách lớp</span>}
              className="rounded-2xl shadow-sm"
            >
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <Table
                  dataSource={classes}
                  columns={classColumns}
                  rowKey="id"
                  pagination={false}
                  className="[&_.ant-table-thead>tr>th]:bg-slate-50"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
