import { Layout, Avatar, Dropdown, Space, Typography, message } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Text } = Typography;

export default function AppHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, roles } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    message.success("Đã đăng xuất thành công!");
    navigate("/login");
  };

  const menuItems = [
    {
      key: "profile",
      label: (
        <Space direction="vertical" size={4} style={{ padding: "8px 0" }}>
          <Text strong style={{ fontSize: 16 }}>
            {user?.hoTen || user?.ho_ten || "Sinh viên"}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {roles
              ?.map((r) => r.replace("ROLE_", "").replace("_", " "))
              .join(", ") || "Sinh viên"}
          </Text>
        </Space>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "profile-page",
      icon: <UserAddOutlined />,
      label: "Hồ sơ cá nhân",
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span style={{ color: "#ff4d4f" }}>Đăng xuất</span>,
      onClick: handleLogout,
    },
  ];

  return (
<Header
  style={{
    background: "#001529",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    height: 64,
    lineHeight: "64px",
  }}
>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        {/* Logo + Tên hệ thống */}
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img
            src="/logo-hutech.png"
            alt="HUTECH"
            style={{ height: 40, marginRight: 16, borderRadius: 8 }}
            onError={(e) => {
              e.target.src =
                "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/tai-anh-dep-ve-may-23.jpg";
            }}
          />
          <span
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            HỆ THỐNG DRL
          </span>
        </div>

        {/* Avatar + Dropdown */}
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["click"]}
          overlayStyle={{
            width: 260,
            borderRadius: 12,
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
          }}
        >
          <a
            onClick={(e) => e.preventDefault()}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Space size={12}>
              <Avatar
                size={42}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#1890ff",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              />
              <div style={{ color: "#fff", lineHeight: 1.3 }}>
                <div style={{ fontWeight: "bold", fontSize: 14 }}>
                  {user?.hoTen || user?.ho_ten || "Sinh viên"}
                </div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>
                  {roles?.includes("ROLE_CanBoKhoa")
                    ? "Cán bộ khoa"
                    : roles
                        ?.map((r) => r.replace("ROLE_", "").replace("_", " "))
                        .join(" • ") || "Sinh viên"}
                </div>
              </div>
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  );
}
