// app/dashboard/page.tsx (โค้ดที่ปรับแก้แล้ว)

import type { Metadata } from "next";
import React from "react";

// เปลี่ยนชื่อไฟล์ Import เพื่อให้ตรงกับระบบ KeyHub ของเรา
import { KeyHubMetrics } from "@/components/analytics/KeyHubMetrics"; 
import SubscriptionSummary from "@/components/analytics/SubscriptionSummary"; 
import MonthlyRevenueChart from "@/components/analytics/MonthlySalesChart"; 
import UserAndOrderStatistics from "@/components/analytics/UserAndOrderStatistic"; 
import RecentKeyOrders from "@/components/analytics/RecentKeyOrders"; 
import MarketingInterests from "@/components/analytics/MarketingInterests"; 

export const metadata: Metadata = {
  title: "KeyHub Admin Dashboard | Game Key & Subscription Management",
  description: "Dashboard สำหรับบริหารจัดการคีย์เกมและการสมัครสมาชิก",
};

export default function DashboardPage() { // เปลี่ยนชื่อ function เป็นชื่อเฉพาะเจาะจง
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <KeyHubMetrics /> {/* แสดงสถิติหลัก */}

        <MonthlyRevenueChart /> {/* แสดงกราฟรายได้ */}
      </div>

      <div className="col-span-12 xl:col-span-5">
        <SubscriptionSummary /> {/* สรุป Subscription */}
      </div>

      <div className="col-span-12">
        <UserAndOrderStatistics /> {/* กราฟสถิติรวม */}
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MarketingInterests /> {/* ข้อมูลการตลาด/ความสนใจลูกค้า */}
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentKeyOrders /> {/* รายการคำสั่งซื้อล่าสุด */}
      </div>
    </div>
  );
}