import { Card, Button, Typography, Space, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
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
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <Card className="rounded-2xl shadow-sm">
          <div className="p-6 sm:p-8">
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Title level={3} className="!mb-1 !text-slate-900">
                    Nộp minh chứng
                  </Title>
                  <Text type="secondary" className="!m-0">
                    Hoạt động có mã <Text strong>#{id}</Text>. Vui lòng tải lên ảnh / file
                    minh chứng tham gia hoạt động.
                  </Text>
                </div>

                <span className="hidden sm:inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  Upload minh chứng
                </span>
              </div>

              {/* Upload area */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                <Dragger {...uploadProps} className="rounded-xl">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined className="text-blue-600" />
                  </p>
                  <p className="ant-upload-text font-semibold text-slate-900">
                    Kéo thả file vào đây hoặc bấm để chọn
                  </p>
                  <p className="ant-upload-hint text-slate-600">
                    Hỗ trợ file hình ảnh, PDF,... dung lượng vừa phải để dễ lưu trữ.
                  </p>
                </Dragger>

                <div className="mt-3 text-xs text-slate-500">
                  Gợi ý: ảnh chụp rõ mặt/bảng tên, hoặc file PDF xác nhận tham gia.
                </div>
              </div>

              {/* Note */}
              <Paragraph className="!mb-0 text-slate-600 text-sm">
                💡 Mỗi hoạt động chỉ cần nộp <strong>01 minh chứng hợp lệ</strong>. Sau khi
                cán bộ duyệt, điểm rèn luyện sẽ được cộng tự động.
              </Paragraph>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                <Button
                  type="default"
                  onClick={() => navigate(-1)}
                  className="h-10 rounded-lg"
                >
                  Quay lại
                </Button>

                <Button
                  type="link"
                  onClick={() => navigate("/my-evidences")}
                  className="!px-0"
                >
                  Xem minh chứng của tôi
                </Button>
              </div>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
}
