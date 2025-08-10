export const BOOKING_MESSAGES = {
  PAYMENT_STEP: {
    TITLE: "Payment Information",
    SUBTITLE: "Enter your payment details to complete your booking",
    CONSULTATION_SUMMARY: "Consultation Summary",
    PAYMENT_METHOD: "Payment Method",
    BILLING_ADDRESS: "Billing Address",
    PAYMENT_SECURITY: "Your payment information is encrypted and secure",
    
    PAYMENT_METHODS: {
      CREDIT_CARD: "Credit Card",
      PAYPAL: "PayPal",
      BANK_TRANSFER: "Bank Transfer",
    },
    
    FIELDS: {
      CARD_NUMBER: "Card Number",
      EXPIRY_DATE: "Expiry Date",
      CVC: "CVC",
      CARDHOLDER_NAME: "Cardholder Name",
      BILLING_ADDRESS: "Street Address",
      CITY: "City",
      STATE: "State",
      ZIP_CODE: "ZIP Code",
      COUNTRY: "Country",
    },
    
    PRICING: {
      PROCESSING_FEE: "Processing Fee",
      TAX: "Tax",
      TOTAL: "Total",
    },
    
    VALIDATION: {
      CARD_NUMBER_REQUIRED: "Card number is required",
      CARD_NUMBER_INVALID: "Please enter a valid card number",
      EXPIRY_REQUIRED: "Expiry date is required",
      EXPIRY_INVALID: "Please enter a valid expiry date (MM/YY)",
      CVC_REQUIRED: "CVC is required",
      CVC_INVALID: "Please enter a valid CVC",
      CARDHOLDER_NAME_REQUIRED: "Cardholder name is required",
      BILLING_ADDRESS_REQUIRED: "Billing address is required",
    },
    
    PLACEHOLDERS: {
      CARD_NUMBER: "1234 5678 9012 3456",
      EXPIRY_DATE: "MM/YY",
      CVC: "123",
      CARDHOLDER_NAME: "John Doe",
      STREET_ADDRESS: "123 Main Street",
      CITY: "New York",
      STATE: "NY",
      ZIP_CODE: "10001",
    },
    
    PAYPAL: {
      TITLE: "PayPal Payment",
      DESCRIPTION: "You will be redirected to PayPal to complete your payment securely.",
    },
    
    BANK_TRANSFER: {
      TITLE: "Bank Transfer Payment",
      DESCRIPTION: "You will receive bank transfer instructions after booking confirmation.",
      NOTE: "Note: Your consultation will be confirmed once payment is received (usually 1-2 business days).",
    },
  },
} as const;
