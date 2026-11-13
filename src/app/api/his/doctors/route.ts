import { NextResponse } from 'next/server';
import { queryHis } from '@/lib/db-his';
import { RowDataPacket } from 'mysql2/promise';

interface DoctorRow extends RowDataPacket { code: string | number; name: string }

export async function GET() {
  try {
    const doctors = await queryHis<DoctorRow[]>(
      `SELECT code, name FROM doctor WHERE code IS NOT NULL AND name IS NOT NULL AND TRIM(name) != '' ORDER BY name, code LIMIT 1000`
    );
    return NextResponse.json({ success: true, data: doctors.map((doctor) => ({ code: String(doctor.code), name: doctor.name.trim() })) });
  } catch {
    return NextResponse.json({ success: false, isHisOffline: true, data: [] }, { status: 503 });
  }
}
