import React from "react";
import { X, User, Mail, Phone, MapPin, Calendar, CreditCard, Shield, Clock, Truck, Star, Store } from "lucide-react";

const DetailRow = ({ icon: Icon, label, value, color = "text-brand-primary" }) => (
  <div className="flex items-start gap-3 py-3 border-b border-brand-border last:border-0">
    <div className={`p-2 rounded-xl bg-brand-bg ${color}`}>
      <Icon size={16} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">{label}</div>
      <div className="text-sm font-semibold text-brand-text mt-0.5 break-words">{value || "Chưa cập nhật"}</div>
    </div>
  </div>
);

const DetailModal = ({ isOpen, onClose, data, type = "user" }) => {
  if (!isOpen || !data) return null;

  const statusColor = {
    active: "bg-green-100 text-green-700",
    approved: "bg-green-100 text-green-700",
    banned: "bg-red-100 text-red-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
  };

  const statusLabel = {
    active: "Hoạt động",
    approved: "Đã duyệt",
    banned: "Đã khóa",
    rejected: "Từ chối",
    pending: "Chờ duyệt",
  };

  const roleLabel = {
    user: "Khách hàng",
    merchant: "Đối tác nhà hàng",
    shipper: "Tài xế",
    admin: "Quản trị viên",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-brand-surface rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-brand-border">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-brand-bg transition-colors text-brand-text-muted hover:text-brand-primary"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-4">
            <img
              src={
                type === "restaurant"
                  ? data.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${data.name}`
                  : type === "user" && data.role === "merchant" && data.restaurantImage
                  ? data.restaurantImage
                  : data.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.fullName}`
              }
              alt={type === "restaurant" ? data.name : type === "user" && data.role === "merchant" && data.restaurantName ? data.restaurantName : data.fullName}
              className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-brand-surface"
            />
            <div>
              <h3 className="text-lg font-black text-brand-text">
                {type === "restaurant" ? data.name : type === "user" && data.role === "merchant" && data.restaurantName ? data.restaurantName : data.fullName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase ${statusColor[data.status] || "bg-brand-border text-brand-text-muted"}`}>
                  {statusLabel[data.status] || data.status}
                </span>
                {type !== "restaurant" && (
                  <span className="text-[10px] font-bold text-brand-text-muted bg-brand-bg px-2 py-0.5 rounded-lg uppercase">
                    {roleLabel[data.role] || data.role}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {type === "restaurant" ? (
            // Restaurant details
            <>
              <DetailRow icon={Store} label="Tên nhà hàng" value={data.name} />
              <DetailRow icon={User} label="Chủ sở hữu" value={data.ownerId?.fullName} />
              <DetailRow icon={Mail} label="Email chủ sở hữu" value={data.ownerId?.email} />
              <DetailRow icon={CreditCard} label="Số CCCD" value={data.ownerId?.cccd} />
              <DetailRow icon={Phone} label="Số điện thoại" value={data.ownerId?.phone || data.phone} />
              <DetailRow icon={MapPin} label="Địa chỉ" value={data.address} />
              <DetailRow icon={Star} label="Loại hình ẩm thực" value={data.category} color="text-amber-500" />
              <DetailRow icon={Clock} label="Ngày tạo" value={data.createdAt ? new Date(data.createdAt).toLocaleString("vi-VN") : null} />
              <DetailRow icon={Clock} label="Ngày cập nhật" value={data.updatedAt ? new Date(data.updatedAt).toLocaleString("vi-VN") : null} />
            </>
          ) : type === "driver" ? (
            // Driver details
            <>
              <DetailRow icon={User} label="Họ và tên" value={data.fullName} />
              <DetailRow icon={Mail} label="Email" value={data.email} />
              <DetailRow icon={Phone} label="Số điện thoại" value={data.phone} />
              <DetailRow icon={CreditCard} label="Số CCCD" value={data.cccd} />
              <DetailRow icon={Calendar} label="Ngày sinh" value={data.dob} />
              <DetailRow icon={MapPin} label="Địa chỉ" value={data.address} />
              <DetailRow icon={Truck} label="Phương tiện" value={data.vehicleType ? `${data.vehicleType} - ${data.licensePlate}` : 'Chưa cập nhật'} />
              <DetailRow icon={Shield} label="Giấy phép lái xe" value={data.driverLicense || 'Chưa cập nhật'} />
              <DetailRow icon={Star} label="Đánh giá" value={data.rating || "5.0"} color="text-amber-500" />
              <DetailRow icon={Clock} label="Ngày đăng ký" value={data.createdAt ? new Date(data.createdAt).toLocaleString("vi-VN") : null} />
            </>
          ) : (
            // User details
            <>
              {data.role === 'merchant' && data.restaurantName && (
                <DetailRow icon={Store} label="Tên nhà hàng" value={data.restaurantName} />
              )}
              <DetailRow icon={User} label="Họ và tên" value={data.fullName} />
              <DetailRow icon={Mail} label="Email" value={data.email} />
              <DetailRow icon={Phone} label="Số điện thoại" value={data.phone} />
              <DetailRow icon={CreditCard} label="Số CCCD" value={data.cccd} />
              <DetailRow icon={Calendar} label={data.role === 'merchant' ? "Ngày thành lập" : "Ngày sinh"} value={data.dob} />
              <DetailRow icon={MapPin} label="Địa chỉ" value={data.role === 'merchant' && data.restaurantAddress ? data.restaurantAddress : data.address} />
              <DetailRow icon={Shield} label="Vai trò" value={roleLabel[data.role] || data.role} />
              <DetailRow icon={Clock} label="Ngày tạo" value={data.createdAt ? new Date(data.createdAt).toLocaleString("vi-VN") : null} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
