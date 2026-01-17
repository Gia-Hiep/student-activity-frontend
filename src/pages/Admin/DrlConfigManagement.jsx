import {
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
} from "antd";
import { useState, useEffect } from "react";
import api from "../../api/api";

const { TabPane } = Tabs;

export default function DrlConfigManagement() {
  const [criteria, setCriteria] = useState([]);
  const [rules, setRules] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [type, setType] = useState("criteria");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [cRes, rRes] = await Promise.all([
      api.get("/drl/criteria"),
      api.get("/drl/rules"),
    ]);
    setCriteria(cRes.data);
    setRules(rRes.data);
  };

  const handleSubmit = async (values) => {
    try {
      if (type === "criteria") {
        await api.post("/drl/criteria", values);
      } else {
        await api.post("/drl/rules", values);
      }
      message.success("Thêm thành công");
      setModalVisible(false);
      loadData();
    } catch (err) {
      message.error("Lỗi");
    }
  };

  const criteriaColumns = [
    { title: "Tiêu chí", dataIndex: "tenTieuChi" },
    { title: "Điểm tối đa", dataIndex: "diemToiDa" },
  ];

  const ruleColumns = [
    { title: "Loại hoạt động", dataIndex: "tenLoai" },
    { title: "Điểm quy đổi", dataIndex: "diemQuyDoi" },
    { title: "Ghi chú", dataIndex: "ghiChu" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Cấu hình tiêu chí & quy đổi điểm rèn luyện
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý tiêu chí DRL và cấu hình quy đổi điểm theo loại hoạt động.
          </p>
        </div>

        <div className="shrink-0">
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Thêm mới
          </Button>
        </div>
      </div>

      {/* Tabs Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Tiêu chí DRL" key="1">
            <Table dataSource={criteria} columns={criteriaColumns} rowKey="id" />
          </TabPane>

          <TabPane tab="Quy đổi điểm" key="2">
            <Table dataSource={rules} columns={ruleColumns} rowKey="id" />
          </TabPane>
        </Tabs>
      </div>

      {/* Modal */}
      <Modal
        title={type === "criteria" ? "Thêm tiêu chí mới" : "Thêm quy đổi điểm"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <div className="space-y-3">
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            {type === "criteria" ? (
              <>
                <Form.Item
                  name="tenTieuChi"
                  label="Tên tiêu chí"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="VD: Ý thức học tập" />
                </Form.Item>

                <Form.Item
                  name="diemToiDa"
                  label="Điểm tối đa"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} max={100} className="w-full" />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="tenLoai"
                  label="Loại hoạt động"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="VD: Tham gia phong trào" />
                </Form.Item>

                <Form.Item
                  name="diemQuyDoi"
                  label="Điểm quy đổi"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} max={50} className="w-full" />
                </Form.Item>

                <Form.Item name="ghiChu" label="Ghi chú">
                  <Input.TextArea placeholder="Nhập ghi chú..." />
                </Form.Item>
              </>
            )}

            <div className="pt-2">
              <Button type="primary" htmlType="submit" block>
                Thêm
              </Button>
            </div>
          </Form>

          <div className="pt-1">
            <Button
              onClick={() => setType(type === "criteria" ? "rules" : "criteria")}
              block
            >
              Chuyển sang {type === "criteria" ? "Quy đổi điểm" : "Tiêu chí"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
