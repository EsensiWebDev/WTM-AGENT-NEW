"use client";

import { addUserAsGuest } from "@/app/(protected)/cart/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { Check, Loader } from "lucide-react";
import React, { useTransition } from "react";
import { toast } from "sonner";

interface SelectUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[];
  selectedUsers: User[];
}

export function SelectUserDialog({
  open,
  onOpenChange,
  users,
  selectedUsers,
}: SelectUserDialogProps) {
  const [searchValue, setSearchValue] = React.useState("");
  const [isPending, startTransition] = useTransition();
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const filteredUsers = React.useMemo(() => {
    if (!searchValue) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [users, searchValue]);

  const handleUserSubmit = () => {
    if (!selectedUser) return;
    startTransition(async () => {
      try {
        const result = await addUserAsGuest(selectedUser);

        if (result.success) {
          toast.success(result.message);
          setSearchValue("");
          setSelectedUser(null);
          onOpenChange(false);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error adding user as guest:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  const isUserSelected = (userId: string) => {
    return selectedUsers.some((user) => user.id === userId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Guest</DialogTitle>
          <DialogDescription>
            Choose a user to add as a guest to your booking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search users..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="border-0 focus:ring-0"
            />
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup>
                {filteredUsers.map((user) => {
                  const isAlreadySelected = isUserSelected(user.id);
                  const isActive = selectedUser?.id === user.id;
                  return (
                    <CommandItem
                      key={user.id}
                      onSelect={() => setSelectedUser(user)}
                      className={`flex items-center gap-3 px-3 py-2 ${
                        isActive ? "bg-accent" : ""
                      }`}
                      disabled={isPending}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      {isAlreadySelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUserSubmit}
            disabled={!selectedUser || isPending}
          >
            {isPending ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
