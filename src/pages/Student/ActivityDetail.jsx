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
      const backendMsg =
        err.response?.data?.message || err.response?.data || "";

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
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin />
      </div>
    );
  }

  if (!activity) return <div>Không tìm thấy hoạt động</div>;

  const isOpen = activity.trangThai === "Mở";

  return (
    <Card title={activity.tenHd} style={{ maxWidth: 800, margin: "20px auto" }}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Loại hoạt động">
          {activity.loai?.tenLoai}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian">
          {new Date(activity.thoiGianBd).toLocaleString()} -{" "}
          {new Date(activity.thoiGianKt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Địa điểm">
          {activity.diaDiem}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={isOpen ? "green" : "red"}>{activity.trangThai}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả">{activity.moTa}</Descriptions.Item>
        <Descriptions.Item label="Giới hạn sinh viên">
          {activity.gioiHanSv
            ? `${registeredCount} / ${activity.gioiHanSv} sinh viên`
            : `${registeredCount} sinh viên (không giới hạn)`}
        </Descriptions.Item>
      </Descriptions>

      <Space
        direction="vertical"
        style={{ width: "100%", marginTop: 20 }}
        size="middle"
      >
        {/* Chỉ hiện nút Đăng ký nếu ĐANG MỞ & CHƯA đăng ký */}
        {isOpen && !hasRegistered && (
          <Button
            type="primary"
            size="large"
            block
            loading={registering}
            onClick={handleRegister}
          >
            Đăng ký ngay
          </Button>
        )}

        {/* Chỉ hiện Check-in / Check-out nếu ĐÃ đăng ký */}
        {hasRegistered && (
          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <Button
              type="default"
              onClick={handleCheckIn}
              loading={attending}
              disabled={hasCheckIn}
              style={{ flex: 1 }}
            >
              {hasCheckIn ? "Đã check-in" : "Check-in"}
            </Button>
            <Button
              danger
              onClick={handleCheckOut}
              loading={attending}
              disabled={!hasCheckIn || hasCheckOut}
              style={{ flex: 1 }}
            >
              {hasCheckOut ? "Đã check-out" : "Check-out"}
            </Button>
            <Button
              type="default"
              danger
              block
              onClick={() => navigate(`/complaints?activityId=${id}`)}
            >
              Gửi khiếu nại
            </Button>
          </Space>
        )}
      </Space>
    </Card>
  );
}
