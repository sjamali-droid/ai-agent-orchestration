import { createConsumer } from '../shared/utils/kafka';
import pool from '../shared/utils/db';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '1025'),
  secure: false,
});

async function createInAppNotification(userId: string, type: string, title: string, message: string, link?: string) {
  await pool.query(
    `INSERT INTO notifications.notifications (user_id, type, title, message, link) VALUES ($1, $2, $3, $4, $5)`,
    [userId, type, title, message, link || null]
  );
}

async function sendEmailIfEnabled(userId: string, subject: string, text: string) {
  const { rows } = await pool.query(
    `SELECT u.email, p.email_notifications FROM auth.users u
     LEFT JOIN notifications.user_preferences p ON p.user_id = u.id
     WHERE u.id = $1 AND u.is_active = true`,
    [userId]
  );

  if (rows.length > 0 && rows[0].email_notifications !== false) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@tasksphere.local',
      to: rows[0].email,
      subject,
      text,
    });
  }
}

export async function startKafkaConsumer() {
  const consumer = createConsumer('notification-service');
  await consumer.connect();

  await consumer.subscribe({ topics: [
    'tasksphere.task.assigned',
    'tasksphere.task.status_changed',
    'tasksphere.comment.created',
    'tasksphere.project.member.added',
    'tasksphere.project.member.removed',
  ], fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const event = JSON.parse(message.value?.toString() || '{}');

        switch (topic) {
          case 'tasksphere.task.assigned':
            await createInAppNotification(
              event.user_id,
              'task_assigned',
              'Task Assigned',
              `You have been assigned a task`,
              `/tasks/${event.task_id}`
            );
            await sendEmailIfEnabled(event.user_id, 'Task Assigned to You', `You were assigned to task ${event.task_id}`);
            break;

          case 'tasksphere.task.status_changed': {
            const { rows: assignees } = await pool.query(
              'SELECT user_id FROM tasks.task_assignees WHERE task_id = $1',
              [event.task_id]
            );
            for (const a of assignees) {
              await createInAppNotification(
                a.user_id,
                'status_changed',
                'Task Status Updated',
                `Task moved from ${event.from} to ${event.to}`,
                `/tasks/${event.task_id}`
              );
            }
            break;
          }

          case 'tasksphere.comment.created': {
            const { rows: watchers } = await pool.query(
              `SELECT DISTINCT user_id FROM (
                SELECT created_by AS user_id FROM tasks.tasks WHERE id = $1
                UNION SELECT user_id FROM tasks.task_assignees WHERE task_id = $1
              ) w WHERE user_id != $2`,
              [event.task_id, event.author_id]
            );
            for (const w of watchers) {
              await createInAppNotification(
                w.user_id,
                'comment',
                'New Comment',
                'A new comment was added to a task you follow',
                `/tasks/${event.task_id}`
              );
            }
            break;
          }

          case 'tasksphere.project.member.added':
            await createInAppNotification(
              event.user_id,
              'project_invite',
              'Added to Project',
              `You were added to a project as ${event.role}`,
              `/projects/${event.project_id}`
            );
            break;

          case 'tasksphere.project.member.removed':
            await createInAppNotification(
              event.user_id,
              'project_removed',
              'Removed from Project',
              'You were removed from a project',
              `/projects/${event.project_id}`
            );
            break;
        }
      } catch (err) {
        console.error(`Failed to process ${topic} event:`, err);
      }
    },
  });

  console.log('Notification Kafka consumer started');
}
