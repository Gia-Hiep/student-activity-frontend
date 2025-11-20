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
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Danh sách khoa">
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn khoa để xem lớp"
            value={selectedKhoa}
            onChange={setSelectedKhoa}
            options={faculties.map((f) => ({
              label: f.tenKhoa,
              value: f.id,
            }))}
          />
        </Card>
      </Col>
      <Col span={16}>
        <Card title="Danh sách lớp">
          <Table
            dataSource={classes}
            columns={classColumns}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </Col>
    </Row>
  );
}
