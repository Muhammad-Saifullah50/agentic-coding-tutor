# ====================================================================
# STRIPE PRICE IDS - REQUIRED FOR CHECKOUT
# ====================================================================
# Get these from: https://dashboard.stripe.com/test/products
# 
# Steps:
# 1. Create "Plus Plan" product with $5 → Copy the Price ID
# 2. Create "Pro Plan" product with $8 → Copy the Price ID
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
# Note: 1 course generation = 10 credits
PLAN_CREDITS = {
    "free": 20,   # 2 course generations
    "plus": 50,   # 5 course generations
    "pro": 100,   # 10 course generations
}
