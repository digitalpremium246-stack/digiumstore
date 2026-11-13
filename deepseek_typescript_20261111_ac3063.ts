// src/lib/storage.ts
import fs from 'fs/promises';
import path from 'path';

export async function saveFileLocally(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Buat nama file unik
  const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  
  // Pastikan folder ada
  await fs.mkdir(uploadDir, { recursive: true });
  
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);
  
  // Return URL yang bisa diakses publik
  return `/uploads/${filename}`;
}