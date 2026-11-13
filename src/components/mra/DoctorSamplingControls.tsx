'use client';

import { useMemo, useState } from 'react';
import { SearchableSelect } from '@/components/ui/SearchableSelect';

export interface SamplingDoctor {
  code: string;
  name: string;
}

export interface DoctorSamplingPlanItem {
  doctorCode: string;
  doctorName: string;
  mode: 'count' | 'percent';
  value: number;
}

interface DoctorSamplingControlsProps {
  doctors: SamplingDoctor[];
  plan: DoctorSamplingPlanItem[];
  onChange: (plan: DoctorSamplingPlanItem[]) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function DoctorSamplingControls({ doctors, plan, onChange, disabled, loading }: DoctorSamplingControlsProps) {
  const [pendingCode, setPendingCode] = useState('');
  const options = useMemo(() => doctors
    .filter((doctor) => !plan.some((item) => item.doctorCode === doctor.code))
    .map((doctor) => ({ value: doctor.code, label: doctor.name, badge: doctor.code })), [doctors, plan]);

  const addDoctor = () => {
    const doctor = doctors.find((item) => item.code === pendingCode);
    if (!doctor) return;
    onChange([...plan, { doctorCode: doctor.code, doctorName: doctor.name, mode: 'count', value: 10 }]);
    setPendingCode('');
  };

  return (
    <section className="space-y-2 rounded-sm border border-slate-200 bg-slate-50/70 p-3">
      <div>
        <h3 className="text-xs font-bold text-slate-800">สุ่มแยกตามแพทย์ (ไม่บังคับ)</h3>
        <p className="mt-0.5 text-[11px] text-slate-500">เลือกแพทย์ได้หลายคน แล้วกำหนดจำนวนหรือเปอร์เซ็นต์ต่อคน ระบบจะสุ่มตามโควตาที่ระบุ</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <SearchableSelect
            options={options}
            value={pendingCode}
            onChange={setPendingCode}
            placeholder={loading ? 'กำลังโหลดรายชื่อแพทย์...' : 'ค้นหาและเลือกแพทย์'}
            searchPlaceholder="ค้นหาชื่อหรือรหัสแพทย์..."
            disabled={disabled || loading}
            emptyMessage="ไม่พบแพทย์ที่ยังไม่ได้เลือก"
          />
        </div>
        <button type="button" onClick={addDoctor} disabled={disabled || !pendingCode || plan.length >= 50} className="rounded-sm border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-900 disabled:cursor-not-allowed disabled:opacity-50">เพิ่มแพทย์</button>
      </div>
      {plan.length > 0 && (
        <div className="space-y-1.5">
          {plan.map((item) => (
            <div key={item.doctorCode} className="grid grid-cols-1 items-center gap-2 rounded-sm border border-slate-200 bg-white p-2 sm:grid-cols-[minmax(0,1fr)_130px_110px_auto]">
              <div className="min-w-0 text-xs font-semibold text-slate-700">{item.doctorName}<span className="ml-1.5 text-[10px] font-normal text-slate-400">{item.doctorCode}</span></div>
              <select aria-label={`วิธีระบุจำนวนของ ${item.doctorName}`} value={item.mode} disabled={disabled} onChange={(event) => onChange(plan.map((row) => row.doctorCode === item.doctorCode ? { ...row, mode: event.target.value as 'count' | 'percent' } : row))} className="h-8 rounded-sm border border-slate-200 px-2 text-xs">
                <option value="count">จำนวนเคส</option><option value="percent">เปอร์เซ็นต์</option>
              </select>
              <div className="flex items-center gap-1">
                <input aria-label={`ค่าโควตาของ ${item.doctorName}`} type="number" min={item.mode === 'percent' ? 1 : 1} max={item.mode === 'percent' ? 100 : 200} value={item.value} disabled={disabled} onChange={(event) => onChange(plan.map((row) => row.doctorCode === item.doctorCode ? { ...row, value: Math.max(1, Math.min(item.mode === 'percent' ? 100 : 200, Number(event.target.value) || 1)) } : row))} className="h-8 w-full rounded-sm border border-slate-200 px-2 text-right text-xs" />
                <span className="w-4 text-xs text-slate-500">{item.mode === 'percent' ? '%' : 'เคส'}</span>
              </div>
              <button type="button" aria-label={`นำ ${item.doctorName} ออกจากรายการ`} disabled={disabled} onClick={() => onChange(plan.filter((row) => row.doctorCode !== item.doctorCode))} className="rounded-sm px-2 py-1 text-xs text-rose-700 hover:bg-rose-50 disabled:opacity-50">นำออก</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
