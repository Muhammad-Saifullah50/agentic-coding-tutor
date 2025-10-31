'use server'


export const updateUserProfile = async (userdata: object) => {

    try {
        const res = await fetch("https://xxcqpwddpfrspgqtxvrb.supabase.co/rest/v1/UserProfile", {
        method: "POST",
        headers: {
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!}`,
            "Content-Type": "application/json",
        },
        // correct the types
        body: JSON.stringify(userdata),
    })

    const data = await res.json()
    return data 
    } catch (error) {
        console.error('Error updating user profile:', error)
    }
   
}

