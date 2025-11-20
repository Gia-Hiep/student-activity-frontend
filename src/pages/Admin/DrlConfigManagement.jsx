import { Tabs, Table, Button, Modal, Form, Input, InputNumber, message } from 'antd';
import { useState, useEffect } from 'react';
import api from '../../api/api';

const { TabPane } = Tabs;

export default function DrlConfigManagement() {
  const [criteria, setCriteria] = useState([]);
  const [rules, setRules] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [type, setType] = useState('criteria');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [cRes, rRes] = await Promise.all([
      api.get('/drl/criteria'),
      api.get('/drl/rules')
    ]);
    setCriteria(cRes.data);
    setRules(rRes.data);
  };

  const handleSubmit = async (values) => {
    try {
      if (type === 'criteria') {
        await api.post('/drl/criteria', values);
      } else {
        await api.post('/drl/rules', values);
      }
      message.success('Thêm thành công');
      setModalVisible(false);
      loadData();
    } catch (err) {
      message.error('Lỗi');
    }
  };

  const criteriaColumns = [
    { title: 'Tiêu chí', dataIndex: 'tenTieuChi' },
    { title: 'Điểm tối đa', dataIndex: 'diemToiDa' },
  ];

  const ruleColumns = [
    { title: 'Loại hoạt động', dataIndex: 'tenLoai' },
    { title: 'Điểm quy đổi', dataIndex: 'diemQuyDoi' },
    { title: 'Ghi chú', dataIndex: 'ghiChu' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Cấu hình tiêu chí & quy đổi điểm rèn luyện</h2>
      
      <Button type="primary" onClick={() => setModalVisible(true)} style={{ marginBottom: 16 }}>
        Thêm mới
      </Button>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Tiêu chí DRL" key="1">
          <Table dataSource={criteria} columns={criteriaColumns} rowKey="id" />
        </TabPane>
        <TabPane tab="Quy đổi điểm" key="2">
          <Table dataSource={rules} columns={ruleColumns} rowKey="id" />
        </TabPane>
      </Tabs>

      <Modal 
        title={type === 'criteria' ? 'Thêm tiêu chí mới' : 'Thêm quy đổi điểm'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          {type === 'criteria' ? (
            <>
              <Form.Item name="tenTieuChi" label="Tên tiêu chí" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="diemToiDa" label="Điểm tối đa" rules={[{ required: true }]}>
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item name="tenLoai" label="Loại hoạt động" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="diemQuyDoi" label="Điểm quy đổi" rules={[{ required: true }]}>
                <InputNumber min={1} max={50} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="ghiChu" label="Ghi chú">
                <Input.TextArea />
              </Form.Item>
            </>
          )}
          <Button type="primary" htmlType="submit" block>Thêm</Button>
        </Form>
        <div style={{ marginTop: 10 }}>
          <Button onClick={() => setType(type === 'criteria' ? 'rules' : 'criteria')} block>
            Chuyển sang {type === 'criteria' ? 'Quy đổi điểm' : 'Tiêu chí'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}