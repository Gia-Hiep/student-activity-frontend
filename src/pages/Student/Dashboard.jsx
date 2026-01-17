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
import { useSelector } from "react-redux";

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

  // Lấy roles từ Redux
  const roles = useSelector((s) => s.auth.roles) || [];

  // Kiểm tra role
  const isOrganizer = roles.some((r) =>
    ["ROLE_Cán sự lớp", "ROLE_Liên chi hội", "ROLE_Cán bộ khoa", "ROLE_Admin"].includes(r)
  );

  const isApprover = roles.some((r) =>
    ["ROLE_Cán sự lớp", "ROLE_Liên chi hội", "ROLE_Cán bộ khoa", "ROLE_Admin"].includes(r)
  );

  const isFaculty = roles.some((r) =>
    ["ROLE_Cán bộ khoa", "ROLE_Admin"].includes(r)
  );

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
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-10 py-8 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <Spin size="large" />
            <Text className="!m-0 text-slate-600">Đang tải dữ liệu...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Chào mừng */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Title level={2} className="!mb-1 !text-slate-900">
            Chào mừng quay lại, {user.hoTen || "Sinh viên"}!
          </Title>
          <Text type="secondary" className="!m-0">
            Hôm nay là {today} • Chúc bạn một ngày tốt lành!
          </Text>
        </div>

        {/* 4 ô thống kê */}
        <Row gutter={[20, 20]} className="!mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              onClick={() => navigate("/registrations/my")}
              className="rounded-2xl shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                cursor: "pointer",
              }}
            >
              <Statistic
                title={<span className="text-white/90">Đã đăng ký</span>}
                value={stats.registered}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              onClick={() => navigate("/my-evidences?status=pending")}
              className="rounded-2xl shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                cursor: "pointer",
              }}
            >
              <Statistic
                title={<span className="text-white/90">Chờ duyệt</span>}
                value={stats.pending}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              onClick={() => navigate("/my-evidences?status=approved")}
              className="rounded-2xl shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                cursor: "pointer",
              }}
            >
              <Statistic
                title={<span className="text-white/90">Đã duyệt</span>}
                value={stats.approved}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              hoverable
              onClick={() => navigate("/my-score")}
              className="rounded-2xl shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                color: "white",
                cursor: "pointer",
              }}
            >
              <Statistic
                title={<span className="text-white/90">Điểm rèn luyện</span>}
                value={stats.totalPoints}
                suffix="/ 100"
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Chức năng nhanh theo role */}
        {(isOrganizer || isApprover || isFaculty) && (
          <Card className="rounded-2xl shadow-sm !mb-6">
            <div className="flex items-center justify-between">
              <Title level={4} className="!mb-0">
                Chức năng quản trị
              </Title>
              <Text type="secondary" className="hidden sm:block">
                Các lối tắt dành cho vai trò quản trị
              </Text>
            </div>

            <div className="mt-4">
              <Row gutter={[16, 16]}>
                {isOrganizer && (
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      onClick={() => navigate("/admin/activities")}
                      className="rounded-xl text-center text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      <CalendarOutlined className="text-3xl mb-2" />
                      <div className="font-semibold">Quản lý hoạt động</div>
                    </Card>
                  </Col>
                )}

                {isApprover && (
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      onClick={() => navigate("/admin/approval")}
                      className="rounded-xl text-center text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        background:
                          "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      }}
                    >
                      <CheckCircleOutlined className="text-3xl mb-2" />
                      <div className="font-semibold">Duyệt minh chứng</div>
                    </Card>
                  </Col>
                )}

                {isOrganizer && (
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      onClick={() => navigate("/admin/attendance")}
                      className="rounded-xl text-center text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        background:
                          "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      }}
                    >
                      <TeamOutlined className="text-3xl mb-2" />
                      <div className="font-semibold">Điểm danh</div>
                    </Card>
                  </Col>
                )}

                {isFaculty && (
                  <>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        onClick={() => navigate("/admin/report")}
                        className="rounded-xl text-center text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        style={{
                          background:
                            "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                        }}
                      >
                        <TrophyOutlined className="text-3xl mb-2" />
                        <div className="font-semibold">Xuất báo cáo</div>
                      </Card>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        onClick={() => navigate("/admin/drl-config")}
                        className="rounded-xl text-center text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        style={{
                          background:
                            "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                        }}
                      >
                        <ClockCircleOutlined className="text-3xl mb-2" />
                        <div className="font-semibold">Cấu hình DRL</div>
                      </Card>
                    </Col>
                  </>
                )}
              </Row>
            </div>
          </Card>
        )}

        {/* Hoạt động sắp tới + Thông tin nhanh */}
        <Row gutter={[20, 20]}>
          <Col xs={24} lg={16}>
            <Card className="rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Title level={4} className="!mb-0">
                  <TeamOutlined /> Hoạt động sắp tới
                </Title>
                <Button
                  type="default"
                  onClick={() => navigate("/activities")}
                  className="rounded-lg"
                >
                  Xem tất cả
                </Button>
              </div>

              {stats.upcoming.length === 0 ? (
                <Text type="secondary">Chưa có hoạt động nào sắp tới.</Text>
              ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <List
                    itemLayout="horizontal"
                    dataSource={stats.upcoming}
                    renderItem={(item) => (
                      <List.Item
                        onClick={() => handleViewActivity(item.id)}
                        className="cursor-pointer hover:bg-slate-50 transition"
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
                              className="rounded-lg"
                            >
                              Đăng ký
                            </Button>
                          ),
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              className="bg-slate-900"
                              icon={<CalendarOutlined />}
                            />
                          }
                          title={<span className="font-semibold">{item.name}</span>}
                          description={
                            <div className="text-slate-600">
                              <ClockCircleOutlined /> {item.date} • {item.location}{" "}
                              {item.status !== "open" && (
                                <Tag color="red" className="ml-2">
                                  Đã đóng
                                </Tag>
                              )}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <Title level={4} className="!mb-0">
                  <TrophyOutlined /> Xếp hạng hiện tại
                </Title>
              </div>

              <div className="text-center py-6">
                <div className="text-6xl font-extrabold text-amber-500">12</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">
                  Hạng 12 lớp
                </div>
                <Divider />
                <div className="text-sm text-slate-500">
                  Tăng 3 bậc so với tháng trước
                </div>
              </div>
            </Card>

            <Card className="mt-5 rounded-2xl shadow-sm" title="Thông báo mới">
              <List>
                <List.Item className="hover:bg-slate-50 transition rounded-lg px-2">
                  <div>
                    <div className="font-semibold text-slate-900">
                      Đã duyệt minh chứng
                    </div>
                    <div className="text-sm text-slate-500">
                      Hiến máu QNU
                    </div>
                  </div>
                </List.Item>
              </List>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
