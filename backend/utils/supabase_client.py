
from supabase import create_client, Client
from dotenv import load_dotenv

import os

load_dotenv()
# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Supabase URL and key must be set in environment variables")

supabase: Client = create_client(supabase_url, supabase_key)
