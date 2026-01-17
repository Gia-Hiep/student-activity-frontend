import { Card, Descriptions } from "antd";
import api from "../../api/api";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/users/me").then((res) => setUser(res.data));
  }, []);

  if (!user)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-600">
        Đang tải...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Thông tin tài khoản
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Thông tin cá nhân và tình trạng tài khoản sinh viên.
          </p>
        </div>

        {/* Profile card */}
        <Card className="rounded-2xl shadow-sm">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="MSSV">
                <span className="font-semibold text-slate-900">
                  {user.mssv}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Họ tên">
                <span className="font-semibold text-slate-900">
                  {user.hoTen}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                <span className="text-slate-700">{user.email}</span>
              </Descriptions.Item>

              <Descriptions.Item label="Lớp">
                <span className="text-slate-700">
                  {user.lop?.tenLop || "-"}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Khoa">
                <span className="text-slate-700">
                  {user.lop?.khoa?.tenKhoa || "-"}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    user.trangThai === "Hoạt động"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                  }`}
                >
                  {user.trangThai}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Card>
      </div>
    </div>
  );
}
