import { Card, Statistic } from 'antd';
import api from '../../api/api';
import { useEffect, useState } from 'react';

export default function MyScore() {
  const [score, setScore] = useState({});

useEffect(() => {
  api.get('/reports/my-score', {
    params: { hocKy: 'HK1', namHoc: '2025-2026' }
  }).then(res => setScore(res.data));
}, []);

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-center mb-10">ĐIỂM RÈN LUYỆN</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <Statistic title="Tổng điểm" value={score.tongDiem || 0} />
        </Card>
        <Card>
          <Statistic title="Xếp loại" value={score.xepLoai || 'Chưa có'} valueStyle={{ color: '#3f8600' }} />
        </Card>
        <Card>
          <Statistic title="Học kỳ" value="HK1 2025-2026" />
        </Card>
      </div>
    </div>
  );
}