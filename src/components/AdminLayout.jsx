import { Layout, Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const { Sider, Content, Header } = Layout;

// nhóm quyền
const ORGANIZER_ROLES = [
  "ROLE_Cán sự lớp",
  "ROLE_Liên chi hội",
  "ROLE_Cán bộ khoa",
  "ROLE_Admin",
];

const APPROVER_ROLES = [
  "ROLE_Cán sự lớp",
  "ROLE_Liên chi hội",
  "ROLE_Cán bộ khoa",
  "ROLE_Admin",
];

const CLASS_LEVEL_ROLES = ["ROLE_Cán sự lớp", "ROLE_Liên chi hội"];

const FACULTY_ROLES = ["ROLE_Cán bộ khoa", "ROLE_Admin"];
const ADMIN_ONLY = ["ROLE_Admin"];

const adminMenu = [
  {
    key: "activities",
    label: "Quản lý hoạt động",
    path: "/admin/activities",
    roles: ORGANIZER_ROLES,
  },
  {
    key: "deploy",
    label: "Nhận từ Khoa",
    path: "/admin/deploy",
    roles: CLASS_LEVEL_ROLES,
  },
  {
    key: "approval",
    label: "Duyệt minh chứng",
    path: "/admin/approval",
    roles: APPROVER_ROLES,
  },
  {
    key: "attendance",
    label: "Điểm danh",
    path: "/admin/attendance",
    roles: ORGANIZER_ROLES,
  },
  {
    key: "drl-config",
    label: "Cấu hình DRL",
    path: "/admin/drl-config",
    roles: FACULTY_ROLES,
  },
  {
    key: "complaints",
    label: "Khiếu nại",
    path: "/admin/complaints",
    roles: FACULTY_ROLES,
  },
  {
    key: "classes",
    label: "Lớp",
    path: "/admin/classes",
    roles: FACULTY_ROLES,
  },
  {
    key: "users",
    label: "Người dùng & vai trò",
    path: "/admin/users",
    roles: FACULTY_ROLES,
  },
  {
    key: "report-export",
    label: "Xuất DRL",
    path: "/admin/report",
    roles: FACULTY_ROLES,
  },
  {
    key: "faculties",
    label: "Khoa",
    path: "/admin/faculties",
    roles: ADMIN_ONLY,
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((s) => s.auth.user);
  const roles = useSelector((s) => s.auth.roles) || [];

  const isFacultyRole =
    roles.includes("ROLE_Cán bộ khoa") || roles.includes("ROLE_Admin");

  // Lọc menu theo quyền
  const visibleMenu = adminMenu.filter((item) =>
    roles.some((r) => item.roles.includes(r))
  );

  const selectedKey = visibleMenu.find((m) =>
    location.pathname.startsWith(m.path)
  )?.key;

  return (
    <Layout style={{ minHeight: "100vh" }} className="bg-slate-50">
      <Sider theme="dark" className="!bg-slate-900 shadow-lg">
        <div
          style={{
            color: "white",
            padding: 16,
            fontWeight: "bold",
            textAlign: "center",
          }}
          className="border-b border-slate-700 tracking-wide text-lg"
        >
          QUẢN TRỊ
        </div>

        <Menu
          theme="dark"
          mode="inline"
          className="!bg-slate-900"
          selectedKeys={selectedKey ? [selectedKey] : []}
          items={visibleMenu.map((m) => ({
            key: m.key,
            label:
              m.key === "activities"
                ? isFacultyRole
                  ? "Hoạt động Khoa"
                  : "Hoạt động Lớp"
                : m.label,
          }))}
          onClick={(item) => {
            const menuItem = visibleMenu.find((m) => m.key === item.key);
            if (menuItem) navigate(menuItem.path);
          }}
        />
      </Sider>

      <Layout className="bg-slate-50">
        <Header style={{ background: "#fff" }} className="shadow-sm" />

        <Content style={{ padding: 24 }} className="p-6">
          <div className="bg-white rounded-xl shadow p-6 min-h-[calc(100vh-120px)]">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
