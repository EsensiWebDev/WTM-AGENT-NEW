"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import {
  CalendarIcon,
  Check,
  ChevronDown,
  ChevronsUpDown,
  CirclePercent,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  createParser,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

const SearchFilter = () => {
  return (
    <section className="mb-0 py-4">
      <div className="mx-4 rounded border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col gap-2 sm:flex-row">
          <LocationSelector />
          <DateRangePicker />
          <GuestCounter />
          <PromoButton />
        </div>
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
          className={"flex-1 justify-between bg-gray-200"}
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
                      value === place.value ? "opacity-100" : "opacity-0",
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

const dateRangeParser = createParser({
  parse: (value) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  },
  serialize: (value) => {
    return format(value, "yyyy-MM-dd");
  },
});

const DateRangePicker = () => {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  const [{ from, to }, setDateRange] = useQueryStates({
    from: dateRangeParser.withDefault(today).withOptions({ shallow: false }),
    to: dateRangeParser.withDefault(tomorrow).withOptions({ shallow: false }),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "flex-1 justify-start bg-gray-200 text-left font-normal",
            !from && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {from && to ? (
            `${format(from, "MMM d, yyyy")} - ${format(to, "MMM d, yyyy")}`
          ) : (
            <span>Select Period</span>
          )}
          <ChevronsUpDown className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          defaultMonth={from}
          selected={{ from, to }}
          onSelect={(dateRange) => {
            if (dateRange) {
              setDateRange({
                from: dateRange.from ? new Date(dateRange.from) : undefined,
                to: dateRange.to ? new Date(dateRange.to) : undefined,
              });
            }
          }}
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
        <Button
          variant={"outline"}
          className={"flex-1 justify-between bg-gray-200"}
        >
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

// Mock promo hotels data
const promoHotels = [
  {
    id: 1,
    name: "Ibis Hotel & Convention Bali",
    roomType: "Business Suite Room for 2 Nights",
    location: "Bali",
  },
  {
    id: 2,
    name: "Atria Hotel Bali",
    roomType: "Twin Room for 2 Nights",
    location: "Bali",
  },
  {
    id: 3,
    name: "Grand Hyatt Jakarta",
    roomType: "Deluxe Room for 3 Nights",
    location: "Jakarta",
  },
  {
    id: 4,
    name: "Shangri-La Surabaya",
    roomType: "Executive Suite for 2 Nights",
    location: "Surabaya",
  },
];

const PromoButton = () => {
  const [open, setOpen] = useState(false);
  const [filteredHotels, setFilteredHotels] = useState(promoHotels);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CirclePercent className="mr-2 h-4 w-4" />
          Find Your Promo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto bg-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Find Your Promo
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Promo Code Input */}
          <div className="space-y-2">
            <div className="rounded-lg bg-gray-100 p-3">
              <p className="text-sm font-medium text-gray-700">
                Code: PROMOWTM15
              </p>
            </div>
          </div>

          {/* Hotel List */}
          <div className="space-y-4">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="rounded-lg p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{hotel.name}</h3>
                      <p className="text-sm text-gray-600">{hotel.roomType}</p>
                    </div>
                    <Link href="/hotel-detail">
                      <Button className="px-6 py-2 text-white">Select</Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No hotels found for the entered promo code.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchFilter;
