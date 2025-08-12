import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "pingup-app" });

// Debug logger — catches ALL events
const logEvent = inngest.createFunction(
  { id: "log-any-event" },
  { event: "*" },
  async ({ event }) => {
    console.log("📩 Incoming event:", event.name, event.data);
  }
);

// Create user
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    let username = email_addresses[0].email_address.split("@")[0];

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      username = username + Math.floor(Math.random() * 10000);
    }

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
      username,
    };

    await User.create(userData);
    console.log(`✅ User created: ${userData.username}`);
  }
);

// Update user
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const updatedUserData = {
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
    };
    await User.findByIdAndUpdate(id, updatedUserData);
    console.log(`♻️ User updated: ${id}`);
  }
);

// Delete user
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
    console.log(`🗑 User deleted: ${id}`);
  }
);

export const functions = [
  logEvent, // Keep this for debugging
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
];
