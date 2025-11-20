import { Table, Button, Modal, Input, message, QRCode } from 'antd';
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { ScanOutlined } from '@ant-design/icons';

export default function AttendanceManagement() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [qrModal, setQrModal] = useState(false);
  const [manualMssv, setManualMssv] = useState('');

  useEffect(() => {
    api.get('/activities').then(res => setActivities(res.data));
  }, []);

  const handleManualCheckIn = async () => {
    if (!selectedActivity) return;
    try {
      await api.post('/attendance/check-in', { hoatDongId: selectedActivity.id });
      message.success(`Điểm danh thành công cho MSSV: ${manualMssv}`);
      setManualMssv('');
    } catch (err) {
      message.error('Lỗi điểm danh');
    }
  };

  const columns = [
    { title: 'Tên hoạt động', dataIndex: 'tenHd', width: 300 },
    { title: 'Thời gian', render: (_, r) => new Date(r.thoiGianBd).toLocaleString() },
    { title: 'Địa điểm', dataIndex: 'diaDiem' },
    {
      title: '',
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
      )
    }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Điểm danh hoạt động</h2>
      <Table dataSource={activities} columns={columns} rowKey="id" />

      <Modal 
        title={`QR Điểm danh: ${selectedActivity?.tenHd}`}
        open={qrModal}
        onCancel={() => setQrModal(false)}
        width={500}
        footer={null}
      >
        <div style={{ textAlign: 'center', padding: 20 }}>
          <QRCode 
            value={`https://yourdomain.com/checkin?activity=${selectedActivity?.id}`} 
            size={256}
            style={{ marginBottom: 20 }}
          />
          <p><strong>Mã hoạt động:</strong> {selectedActivity?.id}</p>
          
          <div style={{ marginTop: 30 }}>
            <Input 
              placeholder="Nhập MSSV thủ công"
              value={manualMssv}
              onChange={e => setManualMssv(e.target.value)}
              style={{ marginBottom: 10 }}
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