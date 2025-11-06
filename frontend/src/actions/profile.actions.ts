'use server'

import { supabaseAdmin } from "@/utils/supabase/admin"
import { UserProfile, UserProfileInput } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { getUserDetails } from "./user.actions";
import { on } from "events";

export const getCurrentUserWithProfile = async () => {
    try {
        const clerkUser = await currentUser()
        const user: UserProfile | null = await getUserDetails(clerkUser?.id);
        return user;
    } catch (error) {
        console.error('Error fetching current user with profile:', error)
        return null
    }

}

export const updateUserProfile = async (userdata: UserProfileInput, userId: string) => {

const dataToUpdate = {...userdata, onBoarded: true};
    try {
        const { error } = await supabaseAdmin
            .from('UserProfile')
            .update(dataToUpdate)
            .eq('userId', userId);
        if (error) {
            throw error;
        }
        return {'success': true};
    } catch (error) {
        console.error('Error updating user profile:', error)
        return {'success': false};
    }

}