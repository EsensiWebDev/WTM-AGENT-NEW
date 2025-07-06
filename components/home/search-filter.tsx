"use client";

import React, { useState } from "react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Check, ChevronDown, MapPin, Users } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns/format";
import { toast } from "sonner";

const SearchFilter = () => {
  return (
    <section className="py-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <LocationSelector />
        <DateRangePicker />
        <GuestCounter />
      </div>
    </section>
  );
};

const places = [
  {
    value: "bali",
    label: "Bali",
  },
  {
    value: "jakarta",
    label: "Jakarta",
  },
  {
    value: "surabaya",
    label: "Surabaya",
  },
  {
    value: "malang",
    label: "Malang",
  },
  {
    value: "bandung",
    label: "Bandung",
  },
];

const LocationSelector = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useQueryState("location", parseAsString);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role={"combobox"}
          aria-expanded={open}
          className={"flex-1 justify-between"}
        >
          <div className={"flex items-center gap-2"}>
            <MapPin className={"h-4 w-4"} />
            <span>
              {value
                ? places.find((place) => place.value === value)?.label
                : "Choose your destination"}
            </span>
          </div>
          <ChevronDown className={"h-4 w-4 opacity-50"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"w-[var(--radix-popover-trigger-width)] p-0"}>
        <Command>
          <CommandInput
            placeholder={"Where you want to stay ?"}
            className={"h-9"}
          />
          <CommandList>
            <CommandEmpty>Not Found</CommandEmpty>
            <CommandGroup>
              {places.map((place) => (
                <CommandItem
                  key={place.value}
                  value={place.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  {place.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === place.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const DateRangePicker = () => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 5, 9),
    to: new Date(2025, 5, 26),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !dateRange?.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from && dateRange?.to ? (
            `${format(dateRange.from, "MMM d, yyyy")} - ${format(
              dateRange.to,
              "MMM d, yyyy"
            )}`
          ) : (
            <span>Select Period</span>
          )}
          <ChevronsUpDown className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          className="rounded-lg border shadow-sm"
        />
      </PopoverContent>
    </Popover>
  );
};

const GuestCounter = () => {
  const [room, setRoom] = useQueryState("room", parseAsInteger.withDefault(1));
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);

  const MAX_ADULTS_PER_ROOM = 2;

  const incrementRoom = () => {
    setRoom((prev) => prev + 1);
  };

  const decrementRoom = () => {
    if (room > 1) {
      // Check if reducing rooms would violate the adult per room rule
      const newRoomCount = room - 1;
      const maxAdultsAllowed = newRoomCount * MAX_ADULTS_PER_ROOM;
      if (adult > maxAdultsAllowed) {
        setAdult(maxAdultsAllowed);
      }
      setRoom(newRoomCount);
    }
  };

  const incrementAdult = () => {
    const maxAdultsAllowed = room * MAX_ADULTS_PER_ROOM;
    if (adult < maxAdultsAllowed) {
      setAdult((prev) => prev + 1);
    } else {
      toast("Maximum adults reached", {
        description: `Maximum ${MAX_ADULTS_PER_ROOM} adults per room allowed.`,
        duration: 3000,
      });
    }
  };

  const decrementAdult = () => {
    if (adult > room) {
      setAdult((prev) => prev - 1);
    } else {
      toast("Minimum adults required", {
        description: "At least 1 adult per room is required.",
        duration: 3000,
      });
    }
  };

  const incrementChildren = () => {
    setChildren((prev) => prev + 1);
  };

  const decrementChildren = () => {
    if (children > 0) {
      setChildren((prev) => prev - 1);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className={"flex-1 justify-between"}>
          <div className={"flex items-center gap-2"}>
            <Users className={"h-4 w-4"} />
            <span>
              {adult} Adult(s), {children} Child, {room} Room
            </span>
          </div>
          <ChevronDown className={"h-4 w-4 opacity-50"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"w-[var(--radix-popover-trigger-width)]"}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="">Adult</span>
            <div className="flex items-center gap-4">
              <Button onClick={decrementAdult} disabled={adult <= room}>
                -
              </Button>
              <span className="w-8 text-center">{adult}</span>
              <Button
                onClick={incrementAdult}
                disabled={adult >= room * MAX_ADULTS_PER_ROOM}
              >
                +
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="">Children</span>
            <div className="flex items-center gap-4">
              <Button onClick={decrementChildren} disabled={children <= 0}>
                -
              </Button>
              <span className="w-8 text-center">{children}</span>
              <Button onClick={incrementChildren}>+</Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="">Room</span>
            <div className="flex items-center gap-4">
              <Button onClick={decrementRoom} disabled={room <= 1}>
                -
              </Button>
              <span className="w-8 text-center">{room}</span>
              <Button
                onClick={incrementRoom}
                // disabled={room >= adult}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchFilter;
