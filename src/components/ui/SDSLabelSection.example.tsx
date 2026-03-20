/**
 * SDSLabelSection — Example usage
 *
 * Use this component in product labels for Safety Data Sheet compliance.
 */

import SDSLabelSection from './SDSLabelSection';

export function SDSLabelSectionExamples() {
  return (
    <div className="flex flex-wrap gap-6 p-6 bg-gray-100">
      {/* Option A: Request mode — "Safety Data Sheet available on request" */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Option A — mode=&quot;request&quot;</p>
        <SDSLabelSection mode="request" showQr />
      </div>

      {/* Option B (recommended): Link mode — "SDS available at: www.lemsolutions.it/sds" */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Option B — mode=&quot;link&quot; (recommended)</p>
        <SDSLabelSection
          mode="link"
          sdsUrl="https://www.lemsolutions.it/sds"
          showQr
        />
      </div>

      {/* Without QR code */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Text only — showQr=false</p>
        <SDSLabelSection mode="link" showQr={false} />
      </div>

      {/* Custom URL */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Custom SDS URL</p>
        <SDSLabelSection
          mode="link"
          sdsUrl="https://www.lemsolutions.it/sds/product-xyz"
          showQr
          qrSize={100}
        />
      </div>
    </div>
  );
}
