import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import api from "../../api/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

const redirectByRole = (roles) => {
  if (!roles || roles.length === 0) return navigate("/");

  // Admin 
  if (roles.includes("ROLE_Admin")) 
    return navigate("/admin/faculties");

  // Cán bộ khoa 
  if (roles.includes("ROLE_Cán bộ khoa")) 
    return navigate("/admin/users");

  // Cán sự lớp / Liên chi hội
  if (
    roles.includes("ROLE_Cán sự lớp") ||
    roles.includes("ROLE_Liên chi hội")
  ) {
    return navigate("/admin/activities");
  }

  // Sinh viên → dashboard
  return navigate("/");
};


  const onFinish = async (values) => {
    try {
      const res = await api.post("/auth/login", values);

      const payload = {
        token: res.data.token,
        user: {
          mssv: res.data.mssv,
          hoTen: res.data.hoTen || "Sinh viên",
        },
        roles: res.data.roles || [],
      };

      dispatch(loginSuccess(payload));

      toast.success("Đăng nhập thành công!");

      // ➜ Redirect theo quyền
      redirectByRole(payload.roles);
    } catch (err) {
      console.error(err);
      toast.error("Sai MSSV hoặc mật khẩu");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Bên trái: giới thiệu hệ thống */}
        <div className="hidden md:block text-white space-y-4">
          <Title level={2} style={{ color: "white", margin: 0 }}>
            HỆ THỐNG ĐIỂM RÈN LUYỆN
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 16 }}>
            Quản lý hoạt động sinh viên, minh chứng và điểm rèn luyện cho sinh
            viên.
          </Text>
          <ul className="list-disc list-inside text-sm space-y-1 text-blue-100 mt-4">
            <li>Theo dõi hoạt động đã đăng ký & điểm danh.</li>
            <li>Nộp và tra cứu minh chứng nhanh chóng.</li>
            <li>Xem điểm rèn luyện theo từng học kỳ.</li>
          </ul>
        </div>

        {/* Bên phải: form login */}
        <Card
          className="w-full shadow-2xl"
          style={{
            borderRadius: 16,
            padding: "32px 24px",
          }}
        >
          <div className="text-center mb-6">
            <Title level={3} style={{ marginBottom: 4 }}>
              Đăng nhập hệ thống
            </Title>
            <Text type="secondary">Đại học Công nghệ TP.HCM</Text>
          </div>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Mã số sinh viên"
              name="mssv"
              rules={[{ required: true, message: "Vui lòng nhập MSSV" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="VD: SV0001"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="matKhau"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="mt-2"
            >
              Đăng nhập
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}
