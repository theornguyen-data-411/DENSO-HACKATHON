## Tổng quan / Overview (VI/EN)

- **Tên dự án**: overview-dashboard (Next.js App Router)
- **Tech stack**: Next 15, React 19, TypeScript, Tailwind CSS v4, Redux Toolkit + Redux-Saga, Radix UI, Recharts.
- **Mục tiêu**: Bảng điều khiển tổng quan năng lượng với KPI, biểu đồ, báo cáo, cài đặt.

### Cấu trúc chính / Key structure
- `app/`: Routing theo App Router (`app/page.tsx`, `app/meters/page.tsx`, `app/reports/page.tsx`, `app/settings/page.tsx`).
- `components/`: Thành phần UI, widget, provider (Redux, Theme), và thư mục `ui/` (các primitive).
- `lib/`: API client, store Redux, saga, slice, utils, và types.
- `styles/`, `public/`, `tailwind.config.ts`, `tsconfig.json`, `next.config.mjs`.

---

## Chạy dự án (VI)

### Yêu cầu
- Node.js 18.18+ hoặc 20+ (khuyến nghị LTS). Kiểm tra: `node -v`.
- Trình quản lý gói: pnpm (khuyến nghị) hoặc npm.

### Cài đặt phụ thuộc
```bash
# PNPM (khuyến nghị)
pnpm install

# Hoặc NPM
npm install
```

### Chạy phát triển
```bash
# Port mặc định: 3000
pnpm dev
# hoặc
npm run dev
```
Truy cập: `http://localhost:3000`.

### Build production và chạy
```bash
# Tạo build
pnpm build
# hoặc
npm run build

# Chạy production
pnpm start
# hoặc
npm run start
```
Lưu ý: `next.config.mjs` đang bật `typescript.ignoreBuildErrors = true` và `images.unoptimized = true` để build dễ dàng trong môi trường demo.

### Lint (tuỳ chọn)
```bash
pnpm lint
# hoặc
npm run lint
```

### Biến môi trường (nếu cần)
- Dự án hiện không yêu cầu `.env` bắt buộc trong cấu trúc repo. Nếu bạn tích hợp API thực, tạo file `.env.local` tại root và đọc biến qua `process.env.XYZ`.

### Mẹo cho Windows (PowerShell)
- Dùng PowerShell/cmd: các lệnh trên chạy tương tự.
- Nếu cổng 3000 bận: `Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process` hoặc đổi cổng: `pnpm dev -- -p 3001`.
- Quyền file dài: bật `git config core.longpaths true` nếu gặp lỗi đường dẫn dài khi clone.

---

## Troubleshooting (VI)
- Không vào được trang, báo module thiếu: chạy lại `pnpm install` hoặc xoá `node_modules` + `pnpm-lock.yaml` rồi `pnpm install`.
- Lỗi version Node: nâng cấp Node LTS (18.18+ hoặc 20+).
- Port bận: đổi cổng `-p 3001` hoặc giải phóng cổng như trên.
- CSS không áp dụng: kiểm tra `app/globals.css` và `tailwind.config.ts` (đã cấu hình Tailwind v4 với PostCSS).

---

## Run the project (EN)

### Prerequisites
- Node.js 18.18+ or 20+ (LTS recommended). Check with `node -v`.
- Package manager: pnpm (recommended) or npm.

### Install dependencies
```bash
# PNPM (recommended)
pnpm install

# Or NPM
npm install
```

### Start development
```bash
# Default port: 3000
pnpm dev
# or
npm run dev
```
Open `http://localhost:3000`.

### Build and start production
```bash
pnpm build
# or
npm run build

pnpm start
# or
npm run start
```
Note: `next.config.mjs` sets `typescript.ignoreBuildErrors = true` and `images.unoptimized = true` for simpler demo builds.

### Lint (optional)
```bash
pnpm lint
# or
npm run lint
```

### Environment variables
- No required `.env` by default. Add `.env.local` if you integrate real backends and access via `process.env.*`.

### Windows tips
- If port 3000 is in use: `pnpm dev -- -p 3001` or free the port via PowerShell.
- Long path issues when cloning: `git config core.longpaths true`.

---

## Ghi chú kiến trúc / Architecture notes
- Redux Toolkit store và Saga nằm trong `lib/store/*`. API clients ở `lib/api/*`.
- Các widget chính của dashboard trong `components/overview/*` và các phần meters/reports/settings tương ứng trong `components/*` và `app/*`.

## Scripts (từ package.json)
- `dev`: chạy Next dev server.
- `build`: build production.
- `start`: chạy server production.
- `lint`: chạy ESLint trên toàn dự án.
