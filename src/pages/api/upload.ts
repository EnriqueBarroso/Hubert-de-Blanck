import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { NextApiRequest, NextApiResponse } from 'next';

// Configuración del cliente R2
const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Solo permitimos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { fileName, fileType } = req.body;

    // Creamos un nombre único con la fecha para no sobrescribir archivos
    const uniqueFileName = `${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    // Generamos la URL firmada (válida por 10 minutos)
    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 600 });

    // Respondemos al frontend con la URL de subida y la URL final
    res.status(200).json({
      uploadUrl: signedUrl,
      finalUrl: `${process.env.NEXT_PUBLIC_R2_DOMAIN}/${uniqueFileName}`,
    });
  } catch (error) {
    console.error("Error en R2:", error);
    res.status(500).json({ error: "Error creando url de subida" });
  }
}