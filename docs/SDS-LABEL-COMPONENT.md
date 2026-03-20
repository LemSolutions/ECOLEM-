# SDSLabelSection — Safety Data Sheet Label Component

Reusable component for product labels handling the Safety Data Sheet (SDS / MSDS) section. Industrial, minimal design suitable for small labels and B&W print.

## Props

| Prop     | Type                 | Default  | Description                                                                 |
|----------|----------------------|----------|-----------------------------------------------------------------------------|
| `sdsUrl` | `string`             | `'/sds'` | Path o URL SDS. Default: usa il dominio corrente (localhost, lemsolutions.it, ecc.) |
| `showQr` | `boolean`            | `true`                       | Whether to display the QR code                                              |
| `mode`   | `"request" \| "link"`| required                     | Text mode: "request" or "link"                                              |
| `className` | `string`           | `""`                         | Optional CSS class for the container                                        |
| `qrSize` | `number`             | `80`                         | QR code size in pixels                                                      |

## Text Modes

- **`mode="request"`** → "Safety Data Sheet available on request"
- **`mode="link"`** → "SDS available at: www.lemsolutions.it/sds"

## Usage

```tsx
import { SDSLabelSection } from '@/components/ui';

// Option A — Request mode
<SDSLabelSection mode="request" showQr />

// Option B (recommended) — Link mode
<SDSLabelSection
  mode="link"
  sdsUrl="https://www.lemsolutions.it/sds"
  showQr
/>

// Text only, no QR
<SDSLabelSection mode="link" showQr={false} />

// Custom product SDS URL
<SDSLabelSection
  mode="link"
  sdsUrl="https://www.lemsolutions.it/sds/toner-ceramico"
  showQr
  qrSize={100}
/>
```

## Design

- Industrial, professional style
- Minimal layout, B&W print friendly
- QR code with "Scan for SDS" label
- Max width ~140px for small labels
