# Stripe Price IDs (replace with actual IDs from Stripe dashboard)
PRICE_IDS = {
    "free": "price_0",   # $0 – free tier (no Stripe price needed, but placeholder for logic)
    "plus": "price_1",   # $50/month
    "pro": "price_2",    # $80/month
}
# Credit bundles (if you later add one‑time credit purchases)
CREDIT_BUNDLES = {
    "credits_100": {"price_id": "price_3", "credits": 100},
    "credits_250": {"price_id": "price_4", "credits": 250},
}