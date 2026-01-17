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
    if (roles.includes("ROLE_Admin")) return navigate("/admin/faculties");

    // Cán bộ khoa
    if (roles.includes("ROLE_Cán bộ khoa")) return navigate("/admin/users");

    // Cán sự lớp / Liên chi hội
    if (roles.includes("ROLE_Cán sự lớp") || roles.includes("ROLE_Liên chi hội"))
      return navigate("/admin/activities");

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

      redirectByRole(payload.roles);
    } catch (err) {
      console.error(err);
      toast.error("Sai MSSV hoặc mật khẩu");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* nền gradient + blur blob */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/40 blur-3xl" />
        <div className="absolute top-1/2 -right-40 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-indigo-600/40 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-purple-600/40 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div className="hidden md:block text-white">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">
                HỆ THỐNG ĐIỂM RÈN LUYỆN
              </h1>
              <p className="text-white/80 text-base leading-relaxed">
                Quản lý hoạt động sinh viên, minh chứng và điểm rèn luyện cho sinh viên.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm text-white/80 mb-3">
                  Bạn có thể:
                </p>
                <ul className="list-disc list-inside text-sm space-y-2 text-blue-100">
                  <li>Theo dõi hoạt động đã đăng ký & điểm danh.</li>
                  <li>Nộp và tra cứu minh chứng nhanh chóng.</li>
                  <li>Xem điểm rèn luyện theo từng học kỳ.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="w-full">
            <div className="mx-auto max-w-md">
              <Card
                className="shadow-2xl rounded-2xl border border-white/10"
                styles={{
                  body: { padding: 0 },
                }}
              >
                <div className="p-8">
                  <div className="text-center mb-6">
                    {/* dùng Tailwind thay vì style inline */}
                    <h2 className="text-2xl font-semibold text-slate-900 mb-1">
                      Đăng nhập hệ thống
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Đại học Công nghệ TP.HCM
                    </p>
                  </div>

                  <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                      label={<span className="font-medium">Mã số sinh viên</span>}
                      name="mssv"
                      rules={[{ required: true, message: "Vui lòng nhập MSSV" }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="VD: SV0001"
                        size="large"
                        className="rounded-lg"
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-medium">Mật khẩu</span>}
                      name="matKhau"
                      rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Mật khẩu"
                        size="large"
                        className="rounded-lg"
                      />
                    </Form.Item>

                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      className="mt-2 h-11 rounded-lg font-semibold"
                    >
                      Đăng nhập
                    </Button>

                    <div className="mt-5 text-center text-xs text-slate-500">
                      Bằng việc đăng nhập, bạn đồng ý với{" "}
                      <span className="text-slate-700 font-medium">
                        quy định sử dụng
                      </span>
                      .
                    </div>
                  </Form>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
