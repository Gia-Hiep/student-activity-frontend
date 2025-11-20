import { Table, Tag, Button, Modal, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import api from '../../api/api';

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    api.get('/complaints').then(res => setComplaints(res.data));
  }, []);

  const handleReply = async () => {
    await api.put(`/complaints/${selected.id}/handle`, {
      trangThai: 'Đã xử lý',
      phanHoi: reply
    });

    message.success('Đã xử lý khiếu nại');
    setComplaints(complaints.map(c =>
      c.id === selected.id ? { ...c, trangThai: 'Đã xử lý' } : c
    ));
    setSelected(null);
  };

  const columns = [
    { title: 'MSSV', dataIndex: ['sinhVien', 'mssv'] },
    { title: 'Họ tên', dataIndex: ['sinhVien', 'hoTen'] },

    { 
      title: 'Hoạt động',
      dataIndex: ['hoatDong', 'tenHd'],
      width: 250
    },

    { title: 'Nội dung', dataIndex: 'noiDung', width: 300 },
    { title: 'Học kỳ', dataIndex: 'hocKy' },
    {
      title: 'Trạng thái',
      render: (_, r) => (
        <Tag color={r.trangThai === 'Đã xử lý' ? 'green' : 'orange'}>
          {r.trangThai}
        </Tag>
      )
    },
    {
      title: '',
      render: (_, r) =>
        r.trangThai !== 'Đã xử lý' && (
          <Button onClick={() => setSelected(r)}>Xử lý</Button>
        )
    }
  ];

  return (
    <div>
      <h2>Xử lý khiếu nại điểm rèn luyện</h2>

      <Table
        dataSource={complaints}
        columns={columns}
        rowKey="id"
      />

      <Modal
        title="Phản hồi khiếu nại"
        open={!!selected}
        onCancel={() => setSelected(null)}
        onOk={handleReply}
      >
        <p><strong>Nội dung khiếu nại:</strong> {selected?.noiDung}</p>
        
        {selected?.hoatDong && (
          <p>
            <strong>Hoạt động:</strong> {selected.hoatDong.tenHd}
          </p>
        )}

        <Input.TextArea
          rows={4}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Nhập phản hồi..."
        />
      </Modal>
    </div>
  );
}
