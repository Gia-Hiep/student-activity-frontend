import { Card, Button, Tag, List, message } from "antd";
import api from "../../api/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/activities");
      setActivities(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách hoạt động");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const register = async (id) => {
    try {
      await api.post("/registrations", { hoatDongId: id });
      message.success("Đăng ký hoạt động thành công!");
      await loadActivities();
    } catch (err) {
      console.error(err);
      const backendMsg = err.response?.data?.message || err.response?.data || "";

      if (typeof backendMsg === "string" && backendMsg.includes("đã đăng ký")) {
        message.warning(backendMsg || "Bạn đã đăng ký hoạt động này rồi");
      } else if (
        typeof backendMsg === "string" &&
        backendMsg.includes("đủ số lượng")
      ) {
        message.error(backendMsg || "Hoạt động đã đủ số lượng");
      } else if (backendMsg) {
        message.error(backendMsg);
      } else {
        message.error("Có lỗi xảy ra khi đăng ký hoạt động");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Danh sách hoạt động
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Chọn một hoạt động để xem chi tiết, đăng ký và điểm danh.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Mở đăng ký
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Đã đóng
            </span>
          </div>
        </div>

        {/* List */}
        <List
          loading={loading}
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
          dataSource={activities}
          locale={{
            emptyText: (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <div className="text-base font-semibold text-slate-900">
                  Chưa có hoạt động nào
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Vui lòng quay lại sau.
                </div>
              </div>
            ),
          }}
          renderItem={(item) => {
            const isOpen = item.trangThai === "Mở";

            return (
              <List.Item>
                {/* Wrapper Tailwind để tạo chiều cao đều + hiệu ứng hover */}
                <div className="h-full">
                  <Card
                    title={
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-slate-900">
                            {item.tenHd}
                          </div>
                        </div>

                        <Tag
                          color={isOpen ? "green" : "red"}
                          className="!m-0"
                        >
                          {item.trangThai}
                        </Tag>
                      </div>
                    }
                    onClick={() => navigate(`/activities/${item.id}`)}
                    hoverable
                    className="h-full rounded-2xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    styles={{ body: { paddingTop: 12 } }}
                  >
                    <div className="space-y-2">
                      <div className="text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">
                          Loại:
                        </span>{" "}
                        {item.loai?.tenLoai}
                      </div>

                      <div className="text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">
                          Thời gian:
                        </span>{" "}
                        {new Date(item.thoiGianBd).toLocaleString()}
                      </div>

                      <div className="text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">
                          Địa điểm:
                        </span>{" "}
                        {item.diaDiem}
                      </div>

                      <div className="pt-2">
                        <Button
                          type="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            register(item.id);
                          }}
                          disabled={!isOpen}
                          className="h-10 rounded-lg font-semibold"
                          block
                        >
                          Đăng ký ngay
                        </Button>

                        {!isOpen && (
                          <div className="mt-2 text-xs text-slate-500">
                            Hoạt động hiện không mở đăng ký.
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
}
