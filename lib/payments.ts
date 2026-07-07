export type PaymentMethod = "cash" | "wave_manual" | "orange_money_manual";

export const PAYMENT_SETTING_KEYS = {
  waveMerchantCode: "payment_wave_merchant_code",
  waveNumber: "payment_wave_number",
  orangeMerchantCode: "payment_orange_merchant_code",
  orangeNumber: "payment_orange_number",
} as const;

export const PAYMENT_METHODS: Record<
  PaymentMethod,
  {
    label: string;
    shortLabel: string;
    adminHint: string;
    referenceLabel?: string;
    phoneLabel?: string;
  }
> = {
  cash: {
    label: "Paiement à la livraison",
    shortLabel: "Livraison",
    adminHint: "Le client paie à la réception.",
  },
  wave_manual: {
    label: "Wave manuel",
    shortLabel: "Wave",
    adminHint: "Vérifier la transaction dans l'application Wave avant de confirmer.",
    referenceLabel: "Référence Wave",
    phoneLabel: "Téléphone Wave utilisé",
  },
  orange_money_manual: {
    label: "Orange Money manuel",
    shortLabel: "OM",
    adminHint: "Vérifier la transaction dans l'application Orange Money avant de confirmer.",
    referenceLabel: "Référence Orange Money",
    phoneLabel: "Téléphone OM utilisé",
  },
};

export const normalizePaymentMethod = (method?: string | null): PaymentMethod =>
  method === "wave_manual" || method === "orange_money_manual" ? method : "cash";

export const getPaymentMethodLabel = (method?: string | null) =>
  PAYMENT_METHODS[normalizePaymentMethod(method)].label;

export const isManualMobilePayment = (method?: string | null) =>
  normalizePaymentMethod(method) === "wave_manual" || normalizePaymentMethod(method) === "orange_money_manual";

export const getPaymentMerchantLines = (
  method: PaymentMethod,
  settings: Record<string, string>,
) => {
  if (method === "wave_manual") {
    return [
      settings[PAYMENT_SETTING_KEYS.waveMerchantCode] ? `Code marchand: ${settings[PAYMENT_SETTING_KEYS.waveMerchantCode]}` : "",
      settings[PAYMENT_SETTING_KEYS.waveNumber] ? `Numéro Wave: ${settings[PAYMENT_SETTING_KEYS.waveNumber]}` : "",
    ].filter(Boolean);
  }

  if (method === "orange_money_manual") {
    return [
      settings[PAYMENT_SETTING_KEYS.orangeMerchantCode] ? `Code marchand: ${settings[PAYMENT_SETTING_KEYS.orangeMerchantCode]}` : "",
      settings[PAYMENT_SETTING_KEYS.orangeNumber] ? `Numéro OM: ${settings[PAYMENT_SETTING_KEYS.orangeNumber]}` : "",
    ].filter(Boolean);
  }

  return [];
};
