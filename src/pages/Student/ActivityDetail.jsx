import { Card, Button, Tag, Descriptions, Space, Spin } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ActivityDetail() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [attending, setAttending] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);

  const [hasRegistered, setHasRegistered] = useState(false);
  const [hasCheckIn, setHasCheckIn] = useState(false);
  const [hasCheckOut, setHasCheckOut] = useState(false);

  const navigate = useNavigate();

  const loadDetail = async () => {
    try {
      setLoading(true);

      // Gọi song song API
      const [actRes, regRes, countRes] = await Promise.all([
        api.get(`/activities/${id}`),
        api.get("/registrations/my"),
        api.get(`/registrations/count?hoatDongId=${id}`),
      ]);

      setActivity(actRes.data);
      setRegisteredCount(countRes.data || 0);

      const activityData = actRes.data;
      const myRegs = regRes.data || [];

      setActivity(activityData);

      // Kiểm tra đã đăng ký + trạng thái checkin/checkout
      const reg = myRegs.find((r) => r.hoatDong?.id === Number(id));

      if (reg) {
        setHasRegistered(true);
        setHasCheckIn(!!reg.daCheckIn);
        setHasCheckOut(!!reg.daCheckOut);
      } else {
        setHasRegistered(false);
        setHasCheckIn(false);
        setHasCheckOut(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không tải được chi tiết hoạt động");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await api.post("/registrations", { hoatDongId: Number(id) });
      toast.success("Đăng ký thành công!");

      setHasRegistered(true);
      await loadDetail(); // reload để cập nhật trạng thái
    } catch (err) {
      console.error(err);
      const backendMsg = err.response?.data?.message || err.response?.data || "";

      if (typeof backendMsg === "string" && backendMsg.includes("đã đăng ký")) {
        toast.warning(backendMsg || "Bạn đã đăng ký hoạt động này rồi");
        setHasRegistered(true);
      } else if (backendMsg) {
        toast.error(backendMsg);
      } else {
        toast.error("Lỗi đăng ký");
      }
    } finally {
      setRegistering(false);
    }
  };

  const handleCheckIn = async () => {
    if (hasCheckIn) {
      return toast.info("Bạn đã check-in rồi");
    }

    try {
      setAttending(true);
      await api.post("/attendance/check-in", { hoatDongId: Number(id) });
      toast.success("Check-in thành công!");
      setHasCheckIn(true);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data || "Lỗi check-in";
      toast.error(msg);
    } finally {
      setAttending(false);
    }
  };

  const handleCheckOut = async () => {
    if (!hasCheckIn) {
      return toast.info("Bạn cần check-in trước khi check-out");
    }
    if (hasCheckOut) {
      return toast.info("Bạn đã check-out rồi");
    }

    try {
      setAttending(true);
      await api.post("/attendance/check-out", {
        hoatDongId: Number(id),
      });
      toast.success("Check-out thành công!");
      setHasCheckOut(true);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data || "Lỗi check-out";
      toast.error(msg);
    } finally {
      setAttending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex items-center justify-center">
          <Spin />
        </div>
      </div>
    );
  }

  if (!activity)
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-lg font-semibold text-slate-900">
            Không tìm thấy hoạt động
          </div>
          <div className="mt-2 text-sm text-slate-500">
            Vui lòng quay lại danh sách và thử lại.
          </div>
        </div>
      </div>
    );

  const isOpen = activity.trangThai === "Mở";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {activity.tenHd}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Chi tiết hoạt động & trạng thái tham gia
            </p>
          </div>

          <div className="shrink-0">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                isOpen
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
              }`}
            >
              {activity.trangThai}
            </span>
          </div>
        </div>

        {/* Card */}
        <Card className="rounded-2xl shadow-sm">
          {/* Descriptions wrapper */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Loại hoạt động">
                <span className="font-medium text-slate-900">
                  {activity.loai?.tenLoai}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Thời gian">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-900">
                    {new Date(activity.thoiGianBd).toLocaleString()}
                  </span>
                  <span className="text-slate-500 text-sm">
                    đến {new Date(activity.thoiGianKt).toLocaleString()}
                  </span>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Địa điểm">
                <span className="text-slate-900">{activity.diaDiem}</span>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                {/* giữ Tag AntD, thêm wrapper */}
                <Tag color={isOpen ? "green" : "red"} className="!m-0">
                  {activity.trangThai}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Mô tả">
                <p className="m-0 leading-relaxed text-slate-700">
                  {activity.moTa}
                </p>
              </Descriptions.Item>

              <Descriptions.Item label="Giới hạn sinh viên">
                <span className="font-medium text-slate-900">
                  {activity.gioiHanSv
                    ? `${registeredCount} / ${activity.gioiHanSv} sinh viên`
                    : `${registeredCount} sinh viên (không giới hạn)`}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Actions */}
          <div className="mt-6">
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              {/* Chỉ hiện nút Đăng ký nếu ĐANG MỞ & CHƯA đăng ký */}
              {isOpen && !hasRegistered && (
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={registering}
                  onClick={handleRegister}
                  className="h-11 rounded-lg font-semibold"
                >
                  Đăng ký ngay
                </Button>
              )}

              {/* Chỉ hiện Check-in / Check-out nếu ĐÃ đăng ký */}
              {hasRegistered && (
                <div className="w-full rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">
                      Thao tác tham gia
                    </div>
                    <div className="text-xs text-slate-500">
                      {hasCheckIn ? "Đã check-in" : "Chưa check-in"} •{" "}
                      {hasCheckOut ? "Đã check-out" : "Chưa check-out"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                      type="default"
                      onClick={handleCheckIn}
                      loading={attending}
                      disabled={hasCheckIn}
                      className="h-10 rounded-lg"
                    >
                      {hasCheckIn ? "Đã check-in" : "Check-in"}
                    </Button>

                    <Button
                      danger
                      onClick={handleCheckOut}
                      loading={attending}
                      disabled={!hasCheckIn || hasCheckOut}
                      className="h-10 rounded-lg"
                    >
                      {hasCheckOut ? "Đã check-out" : "Check-out"}
                    </Button>

                    <Button
                      type="default"
                      danger
                      block
                      onClick={() => navigate(`/complaints?activityId=${id}`)}
                      className="h-10 rounded-lg"
                    >
                      Gửi khiếu nại
                    </Button>
                  </div>
                </div>
              )}

              {/* Hint status */}
              <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                {hasRegistered ? (
                  <span>
                    Bạn đã đăng ký hoạt động. Hãy check-in khi tham gia và check-out khi
                    kết thúc.
                  </span>
                ) : isOpen ? (
                  <span>Hoạt động đang mở đăng ký. Nhấn “Đăng ký ngay” để tham gia.</span>
                ) : (
                  <span>Hoạt động hiện không mở đăng ký.</span>
                )}
              </div>
            </Space>
          </div>
        </Card>

        {/* Footer spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}
