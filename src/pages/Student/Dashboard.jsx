import {
  Card,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Tag,
  Typography,
  Divider,
  Spin,
  Alert,
  Button,
} from "antd";
import { toast } from "react-toastify";
import {
  TrophyOutlined,
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Dashboard() {
  const [stats, setStats] = useState({
    registered: 0,
    pending: 0,
    approved: 0,
    totalPoints: 0,
    upcoming: [],
  });
  const [user, setUser] = useState({ hoTen: "Sinh viên" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi song song cho nhanh
      const [userRes, regRes, scoreRes, evidRes, upcomingRes] =
        await Promise.all([
          api.get("/users/me"),
          api.get("/registrations/my"),
          api.get("/reports/my-score", {
            params: { hocKy: "HK1", namHoc: "2025-2026" },
          }),
          api.get("/evidences/my"),
          api.get("/activities/upcoming").catch(() => ({ data: [] })), // phòng trường hợp API chưa có
        ]);

      const regs = regRes.data || [];
      const score = scoreRes.data || { tongDiem: 0 };
      const evidences = evidRes.data || [];
      let upcoming = upcomingRes.data || [];

      // Nếu API upcoming chưa làm thì dùng dữ liệu mẫu (giữ nguyên đoạn này nếu em muốn)
      if (!Array.isArray(upcoming) || upcoming.length === 0) {
        upcoming = [
          {
            id: 999,
            tenHd: "Hiến máu nhân đạo 2025",
            thoiGianBd: "2025-11-22T08:00:00",
            diaDiem: "Hội trường A",
            trangThai: "Mở",
            daDangKy: false,
          },
        ];
      }

      // Đếm minh chứng
      const pendingEvidenceCount = evidences.filter(
        (e) => e.trangThaiDuyet === "Chờ duyệt"
      ).length;

      const approvedEvidenceCount = evidences.filter(
        (e) => e.trangThaiDuyet === "Đã duyệt"
      ).length;

      setUser(userRes.data);

      setStats({
        // Tổng số hoạt động đã đăng ký
        registered: regs.length,

        // Số MINH CHỨNG "Chờ duyệt"
        pending: pendingEvidenceCount,

        // Số MINH CHỨNG "Đã duyệt"
        approved: approvedEvidenceCount,

        // Điểm rèn luyện
        totalPoints: score.tongDiem || 0,

        // Hoạt động sắp tới
        upcoming: upcoming.map((a) => ({
          id: a.id,
          name: a.tenHd,
          date: new Date(a.thoiGianBd).toLocaleDateString("vi-VN"),
          location: a.diaDiem,
          status: a.trangThai === "Mở" ? "open" : "closed",
          daDangKy: a.daDangKy || false,
        })),
      });
    } catch (err) {
      console.error("Lỗi load dashboard:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Click 1 hoạt động -> xem chi tiết
  const handleViewActivity = (id) => {
    navigate(`/activities/${id}`);
  };

  // Đăng ký hoạt động
const handleRegister = async (e, id) => {
  e.stopPropagation();
  try {
    await api.post("/registrations", { hoatDongId: id });
    toast.success("Đăng ký thành công!");
    await fetchAllData();
  } catch (err) {
    console.error(err);

    const data = err.response?.data;
    let backendMsg = "";

    if (typeof data === "string") {
      backendMsg = data;
    } else if (data && typeof data === "object") {
      backendMsg = data.message || data.error || "";
    }

    if (backendMsg && backendMsg.includes("đã đăng ký")) {
      toast.warning(backendMsg || "Bạn đã đăng ký hoạt động này rồi");
    } else if (backendMsg) {
      toast.error(backendMsg);
    } else {
      toast.error("Đăng ký thất bại");
    }
  }
};


  // Hủy đăng ký hoạt động (nếu bạn có API)
  const handleCancelRegister = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/registrations/${id}`);
      toast.success("Hủy đăng ký thành công");
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error("Hủy đăng ký thất bại");
    }
  };

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
        <Text style={{ display: "block", marginTop: 16 }}>
          Đang tải dữ liệu...
        </Text>
      </div>
    );
  }

  if (error) {
    return <Alert toast="Lỗi" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: "20px 0", background: "#f5f7fa" }}>
      {/* Chào mừng */}
      <div style={{ marginBottom: 30 }}>
        <Title level={2} style={{ color: "#1e3a8a", fontWeight: "bold" }}>
          Chào mừng quay lại, {user.hoTen || "Sinh viên"}!
        </Title>
        <Text type="secondary">
          Hôm nay là {today} • Chúc bạn một ngày tốt lành!
        </Text>
      </div>

      {/* 4 ô thống kê – THÊM onClick + hoverable */}
      <Row gutter={[20, 20]} style={{ marginBottom: 30 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate("/registrations/my")}
            style={{
              borderRadius: 16,
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              cursor: "pointer",
            }}
            styles={{ padding: "20px" }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)" }}>
                  Đã đăng ký
                </span>
              }
              value={stats.registered}
              prefix={<CalendarOutlined />}
              styles={{ color: "white", fontSize: 36, fontWeight: "bold" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate("/evidences/my?status=pending")}
            style={{
              borderRadius: 16,
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              cursor: "pointer",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)" }}>
                  Chờ duyệt
                </span>
              }
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              styles={{ color: "white", fontSize: 36, fontWeight: "bold" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate("/evidences/my?status=approved")}
            style={{
              borderRadius: 16,
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              cursor: "pointer",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)" }}>Đã duyệt</span>
              }
              value={stats.approved}
              prefix={<CheckCircleOutlined />}
              styles={{ color: "white", fontSize: 36, fontWeight: "bold" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            onClick={() => navigate("/my-score")}
            style={{
              borderRadius: 16,
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
              cursor: "pointer",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)" }}>
                  Điểm rèn luyện
                </span>
              }
              value={stats.totalPoints}
              suffix="/ 100"
              prefix={<TrophyOutlined />}
              styles={{ color: "white", fontSize: 42, fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Hoạt động sắp tới + Thông tin nhanh */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Title level={4}>
                <TeamOutlined /> Hoạt động sắp tới
              </Title>
            }
            style={{
              borderRadius: 16,
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            }}
            styles={{
              background: "#1e3a8a",
              color: "white",
              borderRadius: "16px 16px 0 0",
            }}
          >
            {stats.upcoming.length === 0 ? (
              <Text type="secondary">Chưa có hoạt động nào sắp tới.</Text>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={stats.upcoming}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => handleViewActivity(item.id)}
                    style={{ cursor: "pointer" }}
                    actions={[
                      item.daDangKy ? (
                        <Button
                          type="link"
                          danger
                          onClick={(e) => handleCancelRegister(e, item.id)}
                        >
                          Hủy đăng ký
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          onClick={(e) => handleRegister(e, item.id)}
                        >
                          Đăng ký
                        </Button>
                      ),
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ backgroundColor: "#1e3a8a" }}
                          icon={<CalendarOutlined />}
                        />
                      }
                      title={
                        <Text strong style={{ fontSize: 16 }}>
                          {item.name}
                        </Text>
                      }
                      description={
                        <div>
                          <ClockCircleOutlined /> {item.date} • {item.location}{" "}
                          {item.status !== "open" && (
                            <Tag color="red" style={{ marginLeft: 8 }}>
                              Đã đóng
                            </Tag>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Phần xếp hạng & thông báo giữ nguyên */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Title level={4}>
                <TrophyOutlined /> Xếp hạng hiện tại
              </Title>
            }
            style={{
              borderRadius: 16,
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              height: "fit-content",
            }}
            headStyle={{ background: "#f59e0b", color: "white" }}
          >
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{ fontSize: 60, fontWeight: "bold", color: "#f59e0b" }}
              >
                12
              </div>
              <Text strong style={{ fontSize: 18 }}>
                Hạng 12 lớp
              </Text>
              <Divider />
              <Text type="secondary">Tăng 3 bậc so với tháng trước</Text>
            </div>
          </Card>

          <Card
            style={{
              marginTop: 20,
              borderRadius: 16,
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            }}
            title="Thông báo mới"
          >
            <List>
              <List.Item>
                <Text strong>Đã duyệt minh chứng</Text>
                <br />
                <Text type="secondary">Hiến máu HUTECH 2024</Text>
              </List.Item>
            </List>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
