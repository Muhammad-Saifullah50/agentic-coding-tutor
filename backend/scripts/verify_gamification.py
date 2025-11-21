import asyncio
from datetime import date, timedelta
from unittest.mock import MagicMock, patch
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from utils.gamification import update_user_gamification

async def test_gamification_logic():
    print("🧪 Testing Gamification Logic...")
    
    user_id = "test-user"
    today = date.today()
    yesterday = today - timedelta(days=1)
    
    # Mock Supabase
    with patch('utils.gamification.supabase') as mock_supabase:
        # Case 1: First activity (no previous data)
        print("\n1️⃣  Case 1: First activity")
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{
            "streak": 0, "xp": 0, "last_activity_date": None
        }]
        
        await update_user_gamification(user_id)
        
        # Verify update called with streak=1
        args, _ = mock_supabase.table.return_value.update.call_args
        update_data = args[0]
        print(f"   Update Data: {update_data}")
        assert update_data['streak'] == 1
        assert update_data['xp'] == 10
        print("   ✅ Passed")

        # Case 2: Consecutive activity (yesterday was active)
        print("\n2️⃣  Case 2: Consecutive activity")
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{
            "streak": 5, "xp": 100, "last_activity_date": yesterday.isoformat()
        }]
        
        await update_user_gamification(user_id)
        
        args, _ = mock_supabase.table.return_value.update.call_args
        update_data = args[0]
        print(f"   Update Data: {update_data}")
        assert update_data['streak'] == 6
        assert update_data['xp'] == 110
        print("   ✅ Passed")

        # Case 3: Same day activity (already active today)
        print("\n3️⃣  Case 3: Same day activity")
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{
            "streak": 6, "xp": 110, "last_activity_date": today.isoformat()
        }]
        
        await update_user_gamification(user_id)
        
        args, _ = mock_supabase.table.return_value.update.call_args
        update_data = args[0]
        print(f"   Update Data: {update_data}")
        assert update_data['streak'] == 6
        assert update_data['xp'] == 120
        print("   ✅ Passed")

        # Case 4: Missed a day (last active 2 days ago)
        print("\n4️⃣  Case 4: Missed a day")
        two_days_ago = today - timedelta(days=2)
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{
            "streak": 10, "xp": 200, "last_activity_date": two_days_ago.isoformat()
        }]
        
        await update_user_gamification(user_id)
        
        args, _ = mock_supabase.table.return_value.update.call_args
        update_data = args[0]
        print(f"   Update Data: {update_data}")
        assert update_data['streak'] == 1
        assert update_data['xp'] == 210
        print("   ✅ Passed")

if __name__ == "__main__":
    asyncio.run(test_gamification_logic())
