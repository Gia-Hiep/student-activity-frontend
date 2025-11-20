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
      const backendMsg =
        err.response?.data?.message || err.response?.data || "";

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
    <div>
      <h2 className="text-2xl font-bold mb-6">Danh sách hoạt động</h2>
      <List
        loading={loading}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
        dataSource={activities}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={item.tenHd}
              extra={
                <Tag color={item.trangThai === "Mở" ? "green" : "red"}>
                  {item.trangThai}
                </Tag>
              }
              onClick={() => navigate(`/activities/${item.id}`)}
              hoverable
            >
              <p>
                <strong>Loại:</strong> {item.loai?.tenLoai}
              </p>
              <p>
                <strong>Thời gian:</strong>{" "}
                {new Date(item.thoiGianBd).toLocaleString()}
              </p>
              <p>
                <strong>Địa điểm:</strong> {item.diaDiem}
              </p>
              <Button
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  register(item.id);
                }}
                disabled={item.trangThai !== "Mở"}
              >
                Đăng ký ngay
              </Button>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
