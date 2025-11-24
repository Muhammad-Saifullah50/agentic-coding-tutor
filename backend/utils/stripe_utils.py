import os
import stripe
from .supabase_client import supabase
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
# Helper to retrieve or create a Stripe Customer for a user
def get_or_create_customer(user_id: str, email: str):
    profile = supabase.table("UserProfile").select("stripe_customer_id").eq("userId", user_id).execute()
    if profile.data and profile.data[0].get("stripe_customer_id"):
        return profile.data[0]["stripe_customer_id"]
    customer = stripe.Customer.create(email=email, metadata={"user_id": user_id})
    supabase.table("UserProfile").update({"stripe_customer_id": customer.id}).eq("userId", user_id).execute()
    return customer.id
def create_checkout_session(user_id: str, email: str, plan_key: str, success_url: str, cancel_url: str):
    from config.payment_constants import PRICE_IDS
    if plan_key not in PRICE_IDS:
        raise ValueError(f"Unknown plan: {plan_key}")
    price_id = PRICE_IDS[plan_key]
    customer_id = get_or_create_customer(user_id, email)
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        mode="subscription",
        customer=customer_id,
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=success_url,
        cancel_url=cancel_url,
    )
    return session.id
def handle_webhook(event: dict):
    from config.payment_constants import PRICE_IDS
    event_type = event.get("type")
    data = event.get("data", {}).get("object", {})
    if event_type == "checkout.session.completed":
        customer_id = data.get("customer")
        subscription = data.get("subscription")
        # Find user by customer ID
        profile = supabase.table("UserProfile").select("*", "id").eq("stripe_customer_id", customer_id).execute()
        if not profile.data:
            return
        user = profile.data[0]
        # Determine plan from price ID
        line_items = stripe.checkout.Session.list_line_items(data["id"])
        price_id = line_items.data[0].price.id if line_items.data else None
        plan_key = next((k for k, v in PRICE_IDS.items() if v == price_id), None)
        # Update user profile
        updates = {
            "subscription_plan": plan_key,
            "stripe_subscription_id": subscription,
        }
        # Set initial credits based on plan
        if plan_key == "free":
            updates["credits"] = 20
        elif plan_key == "plus":
            updates["credits"] = 50
        elif plan_key == "pro":
            updates["credits"] = 100
        supabase.table("UserProfile").update(updates).eq("id", user["id"]).execute()
    elif event_type == "invoice.payment_failed":
        # Handle payment failure (optional: downgrade plan, notify user)
        pass
    # Add more event handling as needed