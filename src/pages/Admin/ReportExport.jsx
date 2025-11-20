import { Button } from 'antd';
import api from '../../api/api';

export default function ReportExport() {
  const exportExcel = () => {
    api.get('/reports/export/excel?khoaId=1&hocKy=HK1&namHoc=2025-2026', { responseType: 'blob' })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'diem_ren_luyen.xlsx');
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <div className="p-10 text-center">
      <h2 className="text-3xl font-bold mb-10">XUẤT BÁO CÁO ĐIỂM RÈN LUYỆN</h2>
      <Button type="primary" size="large" onClick={exportExcel}>
        Tải file Excel ngay
      </Button>
    </div>
  );
}