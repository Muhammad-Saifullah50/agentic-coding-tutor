# ====================================================================
# STRIPE PRICE IDS - REQUIRED FOR CHECKOUT
# ====================================================================
# Get these from: https://dashboard.stripe.com/test/products
# 
# Steps:
# 1. Create "Plus Plan" product with $50/month → Copy the Price ID
# 2. Create "Pro Plan" product with $80/month → Copy the Price ID
# 3. Paste the Price IDs below (format: price_xxxxxxxxxxxxx)
# ====================================================================

from dotenv import load_dotenv
import os
load_dotenv()

plus_plan_price_id = os.getenv("PLUS_PLAN_PRICE_ID")
pro_plan_price_id = os.getenv("PRO_PLAN_PRICE_ID")

PRICE_IDS = {
    "free": None,  # Free tier - no Stripe checkout needed
    "plus": plus_plan_price_id,   # TODO: Replace with actual Price ID from Stripe Dashboard
    "pro": pro_plan_price_id,      # TODO: Replace with actual Price ID from Stripe Dashboard
}

# Plan credits (automatically assigned after successful payment)
PLAN_CREDITS = {
    "free": 2,
    "plus": 5,
    "pro": 10,
}
