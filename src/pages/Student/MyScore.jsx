import { Card, Statistic } from "antd";
import api from "../../api/api";
import { useEffect, useState } from "react";

export default function MyScore() {
  const [score, setScore] = useState({});

  useEffect(() => {
    api
      .get("/reports/my-score", {
        params: { hocKy: "HK1", namHoc: "2025-2026" },
      })
      .then((res) => setScore(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Điểm rèn luyện
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Học kỳ <span className="font-semibold">HK1</span> • Năm học{" "}
            <span className="font-semibold">2025 – 2026</span>
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl shadow-sm text-center">
            <Statistic
              title={<span className="text-slate-600">Tổng điểm</span>}
              value={score.tongDiem || 0}
              valueStyle={{
                fontSize: 40,
                fontWeight: "bold",
                color: "#1e3a8a",
              }}
            />
            <div className="mt-2 text-xs text-slate-500">
              Tổng điểm rèn luyện đạt được
            </div>
          </Card>

          <Card className="rounded-2xl shadow-sm text-center">
            <Statistic
              title={<span className="text-slate-600">Xếp loại</span>}
              value={score.xepLoai || "Chưa có"}
              valueStyle={{
                fontSize: 28,
                fontWeight: "bold",
                color:
                  score.xepLoai === "Xuất sắc"
                    ? "#16a34a"
                    : score.xepLoai === "Tốt"
                    ? "#2563eb"
                    : score.xepLoai === "Khá"
                    ? "#0284c7"
                    : "#475569",
              }}
            />
            <div className="mt-2 text-xs text-slate-500">
              Dựa trên tổng điểm rèn luyện
            </div>
          </Card>

          <Card className="rounded-2xl shadow-sm text-center">
            <Statistic
              title={<span className="text-slate-600">Học kỳ</span>}
              value="HK1 2025–2026"
              valueStyle={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#334155",
              }}
            />
            <div className="mt-2 text-xs text-slate-500">
              Thời gian áp dụng
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
