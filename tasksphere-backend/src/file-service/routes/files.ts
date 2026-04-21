import { Router, Request, Response } from 'express';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import pool from '../../shared/utils/db';
import { authenticate, requireRole } from '../../shared/middleware/auth';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const s3 = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
  },
});

const BUCKET = process.env.S3_BUCKET || 'tasksphere-attachments';

export const fileRouter = Router();

fileRouter.use(authenticate);

fileRouter.post('/upload-url', requireRole('member'), async (req: Request, res: Response) => {
  try {
    const { task_id, filename, content_type, size_bytes } = req.body;

    if (!task_id || !filename || !content_type || !size_bytes) {
      res.status(400).json({ error: 'task_id, filename, content_type, and size_bytes are required' });
      return;
    }

    if (!ALLOWED_TYPES.includes(content_type)) {
      res.status(400).json({ error: `content_type must be one of: ${ALLOWED_TYPES.join(', ')}` });
      return;
    }

    if (size_bytes > MAX_SIZE) {
      res.status(400).json({ error: 'File exceeds 5MB limit' });
      return;
    }

    const taskExists = await pool.query('SELECT id FROM tasks.tasks WHERE id = $1', [task_id]);
    if (taskExists.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const s3Key = `tasks/${task_id}/${uuid()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      ContentType: content_type,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    const { rows: [attachment] } = await pool.query(
      `INSERT INTO tasks.attachments (task_id, uploaded_by, filename, content_type, size_bytes, s3_key)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, filename, content_type, size_bytes`,
      [task_id, req.user!.userId, filename, content_type, size_bytes, s3Key]
    );

    res.status(201).json({ ...attachment, upload_url: uploadUrl });
  } catch (err) {
    console.error('Upload URL error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

fileRouter.get('/:attachmentId/download-url', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT s3_key, filename, content_type FROM tasks.attachments WHERE id = $1',
      [req.params.attachmentId]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Attachment not found' });
      return;
    }

    const command = new GetObjectCommand({ Bucket: BUCKET, Key: rows[0].s3_key });
    const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    res.json({ download_url: downloadUrl, filename: rows[0].filename, content_type: rows[0].content_type });
  } catch (err) {
    console.error('Download URL error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

fileRouter.get('/task/:taskId', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, filename, content_type, size_bytes, created_at FROM tasks.attachments WHERE task_id = $1 ORDER BY created_at DESC',
      [req.params.taskId]
    );
    res.json(rows);
  } catch (err) {
    console.error('List attachments error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
