# ISSUE-0034: Image/Attachment Upload (S3)

## Meta

- **Status**: backlog
- **Type**: story
- **Priority**: high
- **Sprint**: backlog
- **Assigned agent**: developer
- **Epic**: ISSUE-0003
- **Milestone**: m2

## Description

File upload for task attachments: PNG, JPG, PDF. Stored in S3-compatible storage. Max 5 MB per file (SRS §3.2).

## Acceptance criteria

- [ ] POST /tasks/:id/attachments — upload file (Member+ role)
- [ ] GET /tasks/:id/attachments — list attachments with signed URLs
- [ ] DELETE /tasks/:id/attachments/:attachmentId — delete (uploader or PM+)
- [ ] File type validation: PNG, JPG, PDF only
- [ ] File size validation: max 5 MB, reject with 413
- [ ] Files stored in S3 bucket with task-scoped prefix
- [ ] Presigned URLs for download (expire in 1 hour)
- [ ] Unit tests + integration test with local S3 (MinIO)
