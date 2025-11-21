from datetime import date, timedelta
from utils.supabase_client import supabase

async def update_user_gamification(user_id: str, xp_reward: int = 10):
    """
    Updates the user's streak and XP.
    - streak: increments if activity is consecutive, resets if missed a day.
    - xp: adds xp_reward.
    - last_activity_date: updates to today.
    """
    today = date.today()
    
    # Fetch current stats
    response = supabase.table("UserProfile").select("streak, xp, last_activity_date").eq("userId", user_id).execute()
    
    if not response.data:
        # User might not exist in UserProfile yet, or error.
        # For now, we can log it or attempt to create.
        # Assuming UserProfile should exist.
        print(f"⚠️ UserProfile not found for {user_id} during gamification update.")
        return

    user_data = response.data[0]
    current_streak = user_data.get("streak", 0) or 0
    current_xp = user_data.get("xp", 0) or 0
    last_activity_str = user_data.get("last_activity_date")
    
    new_streak = current_streak
    
    if last_activity_str:
        last_activity = date.fromisoformat(last_activity_str)
        if last_activity == today:
            # Already active today, streak doesn't change
            pass
        elif last_activity == today - timedelta(days=1):
            # Consecutive day
            new_streak += 1
        else:
            # Missed a day (or more)
            new_streak = 1
    else:
        # First activity
        new_streak = 1
        
    new_xp = current_xp + xp_reward
    
    # Update DB
    update_data = {
        "streak": new_streak,
        "xp": new_xp,
        "last_activity_date": today.isoformat()
    }
    
    supabase.table("UserProfile").update(update_data).eq("userId", user_id).execute()
    print(f"🎮 Gamification updated for {user_id}: Streak {new_streak}, XP {new_xp}")
    
    return {
        "streak": new_streak,
        "xp": new_xp
    }
