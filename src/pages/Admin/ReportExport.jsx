import { Button } from "antd";
import api from "../../api/api";

export default function ReportExport() {
  const exportExcel = () => {
    api
      .get("/reports/export/excel?khoaId=1&hocKy=HK1&namHoc=2025-2026", {
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "diem_ren_luyen.xlsx");
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-slate-200 shadow-sm rounded-2xl p-10 text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
            XUẤT BÁO CÁO ĐIỂM RÈN LUYỆN
          </h2>
          <p className="text-sm text-slate-500">
            Tải báo cáo điểm rèn luyện theo khoa / học kỳ / năm học dưới dạng
            Excel.
          </p>
        </div>

        <div className="pt-2">
          <Button type="primary" size="large" onClick={exportExcel}>
            Tải file Excel ngay
          </Button>
        </div>

        <div className="text-xs text-slate-400">
          File sẽ được tải về dưới dạng <span className="font-medium">.xlsx</span>
        </div>
      </div>
    </div>
  );
}
