# elysiajs-app

## To install dependencies:

```bash [Terminal]
bun install
```

Creates and applies database migrations:

```bash [Terminal]
bun prisma migrate dev --name init
```

Generates Prisma client only:

```bash [Terminal]
bun prisma generate --no-engine
```

Open Prisma Studio (GUI):

```bash [Terminal]
bun prisma studio
```

Run unit tests

```bash [Terminal]
bun test
```

To run the example application:

```bash [Terminal]
bun run dev
```

Build and Deploy to production:

```bash [Terminal]
bun run build
```

```bash [Terminal]
bun run start:prod
```

Deploy to production (PM2):

```bash [Terminal]
pm2 start ecosystem.config.cjs --env production
```

## Commit types
```bash
🎉 Initial commit

👷 build:     — เปลี่ยนแปลงระบบ build หรือ dependencies เช่น npm เป็นต้น
✨ feat:      — ใช้สำหรับการเพิ่มฟีเจอร์ใหม่ลงมาใน Codebase ของเรา
🐛 fix:       — ใช้สำหรับการแก้ไข Bug ต่าง ๆ ใน Codebase
📚 docs:      — ประเภทนี้ใช้สำหรับการที่เราเปลี่ยนแปลงแค่เฉพาะ Document
🎨 style:     — เปลี่ยนแค่สไตล์ ไม่กระทบกับฟังก์ชัน
♻️ chore:     — การเปลี่ยนแปลงอื่นๆ ที่ไม่ได้แก้ไขไฟล์ src หรือ test
🔨 refactor:  — ปรับโครงสร้างโค้ด ทำความสะอาดโค้ด ให้ดีขึ้นโดยไม่เพิ่มฟีเจอร์ หรือแก้บั๊ก
🚀 perf:      — คำนี้มาจาก Performance หรือ การปรับปรุงประสิทธิภาพการทำงานนั่นเอง
🚨 test:      — การเปลี่ยนแปลงในส่วนของ Test ที่เราสร้างไว้ เช่น เพิ่ม Test-case
👷 ci:        — ปรับปรุง เปลี่ยนแปลง CI Config ของไฟล์ หรือ สคริปต์ เช่น Jenkins, GitLab CI
⏪ revert:    — ย้อนกลับ commit
```

### Load Test Tools:

```bash [Terminal]
bun install autocannon -g
```

```bash [Terminal]
npx autocannon http://localhost:4001/v1/users -a 100 --header "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.xxx"
```

## Deploy on Render

Build Command:

```bash [Terminal]
bun run build;
```

Start Command:

```bash [Terminal]
bun run start:prod
```