// src/components/profile/ProfileSelector.tsx
import { useState } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Users } from "lucide-react";

import { createProfile } from "../features/profiles/profileThunks";
import { setCurrentProfile } from "../features/profiles/profileSlice";

export const ProfileSelector = () => {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector((state) => state.profiles.profiles);
  const currentProfile = useAppSelector(
    (state) => state.profiles.currentProfile
  );

  const [isAdding, setIsAdding] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");

  const handleAddProfile = () => {
    if (newProfileName.trim()) {
      // dispatch thunk to create profile
      dispatch(
        createProfile({ name: newProfileName.trim(), timezone: "Asia/Kolkata" })
      ); // default timezone
      setNewProfileName("");
      setIsAdding(false);
    }
  };

  const handleProfileChange = (profileId: string) => {
    const selected = profiles.find((p) => p._id === profileId) || null;
    dispatch(setCurrentProfile(selected));
  };

  if (isAdding) {
    return (
      <div className="flex items-center gap-2">
        <Input
          placeholder="Enter profile name..."
          value={newProfileName}
          onChange={(e) => setNewProfileName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddProfile();
            if (e.key === "Escape") {
              setIsAdding(false);
              setNewProfileName("");
            }
          }}
          className="w-64"
          autoFocus
        />
        <Button onClick={handleAddProfile} size="sm">
          Add
        </Button>
        <Button
          onClick={() => {
            setIsAdding(false);
            setNewProfileName("");
          }}
          variant="outline"
          size="sm"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentProfile?._id || ""}
        onValueChange={handleProfileChange}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select current profile..." />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem key={profile._id} value={profile._id}>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {profile.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={() => setIsAdding(true)} variant="outline" size="sm">
        Add Profile
      </Button>
    </div>
  );
};
