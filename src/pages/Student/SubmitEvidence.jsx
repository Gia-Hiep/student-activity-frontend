// src/pages/Student/SubmitEvidence.jsx
import { Card, Button, Typography, Space, Upload } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import api from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

export default function SubmitEvidence() {
  const { id } = useParams();
  const navigate = useNavigate();

  const uploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("hoatDongId", id);

      try {
        const res = await api.post("/evidences/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Nộp minh chứng thành công!");
        onSuccess && onSuccess(res.data);
      } catch (err) {
        const backendMsg =
          err.response?.data?.message ||
          (typeof err.response?.data === "string" ? err.response.data : "") ||
          "Lỗi nộp minh chứng";

        toast.error(backendMsg);
        onError && onError(err);
        return;
      }
    },
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "24px auto",
      }}
    >
      <Card
        style={{
          borderRadius: 16,
          boxShadow: "0 6px 20px rgba(15, 23, 42, 0.12)",
          border: "1px solid #e5e7eb",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {/* Tiêu đề */}
          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              Nộp minh chứng
            </Title>
            <Text type="secondary">
              Hoạt động có mã <Text strong>#{id}</Text>. Vui lòng tải lên ảnh /
              file minh chứng tham gia hoạt động.
            </Text>
          </div>

          {/* Khu vực upload đẹp đẹp */}
          <Dragger {...uploadProps} style={{ borderRadius: 12 }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#1677ff" }} />
            </p>
            <p className="ant-upload-text">
              Kéo thả file vào đây hoặc bấm để chọn
            </p>
            <p className="ant-upload-hint">
              Hỗ trợ file hình ảnh, PDF,... dung lượng vừa phải để dễ lưu trữ.
            </p>
          </Dragger>

          {/* Gợi ý / hướng dẫn nhỏ */}
          <Paragraph type="secondary" style={{ marginTop: 8, fontSize: 13 }}>
            💡 Mỗi hoạt động chỉ cần nộp <strong>01 minh chứng hợp lệ</strong>.
            Sau khi cán bộ duyệt, điểm rèn luyện sẽ được cộng tự động.
          </Paragraph>

          {/* Nút xem minh chứng của tôi */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <Button type="link" onClick={() => navigate("/my-evidences")}>
              Xem minh chứng của tôi
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
}
