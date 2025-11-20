import { Card, Descriptions } from "antd";
import api from "../../api/api";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/users/me").then((res) => setUser(res.data));
  }, []);

  if (!user) return <div>Đang tải...</div>;

  return (
    <Card title="Thông tin tài khoản" className="max-w-xl mx-auto mt-6">
      <Descriptions column={1} bordered>
        <Descriptions.Item label="MSSV">{user.mssv}</Descriptions.Item>
        <Descriptions.Item label="Họ tên">{user.hoTen}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Lớp">{user.lop?.tenLop}</Descriptions.Item>
        <Descriptions.Item label="Khoa">
          {user.lop?.khoa?.tenKhoa}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {user.trangThai}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
