// app/api/upload/route.ts
import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// โฟลเดอร์เก็บไฟล์
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const nodeReq = req as unknown as NodeJS.ReadableStream; // 👈 cast เป็น Node stream

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });

  return new Promise((resolve) => {
    form.parse(nodeReq as any, (err, fields, files: any) => {
      if (err) {
        console.error(err);
        return resolve(
          NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 })
        );
      }

      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      if (!file) {
        return resolve(
          NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })
        );
      }

      const fileUrl = `/uploads/${path.basename(file.filepath)}`;
      resolve(NextResponse.json({ success: true, url: fileUrl }));
    });
  });
}
