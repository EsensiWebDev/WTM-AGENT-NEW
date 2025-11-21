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
  Search,
  Users,
} from "lucide-react";

import { fetchListProvince } from "@/server/general";
import {
  createParser,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Input } from "../ui/input";

const SearchFilter = ({
  provincesPromise,
}: {
  provincesPromise: Promise<Awaited<ReturnType<typeof fetchListProvince>>>;
}) => {
  const provinces = React.use(provincesPromise);

  return (
    <section className="mb-0 py-4">
      <div className="mx-4 rounded border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col gap-2 sm:flex-row">
          <LocationSelector provinces={provinces} />
          <DateRangePicker />
          <GuestCounter />
          <PromoButton />
        </div>
      </div>
    </section>
  );
};

const LocationSelector = ({
  provinces,
}: {
  provinces: Awaited<ReturnType<typeof fetchListProvince>>;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useQueryState(
    "province",
    parseAsString.withOptions({ shallow: false }),
  );

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
                ? provinces.find((place) => place.value === value)?.label
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
              {provinces.map((place) => (
                <CommandItem
                  key={place.value}
                  value={place.value}
                  onSelect={(currentValue) => {
                    if (value === currentValue) {
                      setValue(null);
                    } else {
                      setValue(currentValue);
                    }
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

// Mock promo data with hotels
const promoData = [
  {
    id: 1,
    code: "PAYDAY15",
    title: "Payday Sale | Free Breakfast",
    description: "Get free breakfast with selected hotels",
    hotels: [
      {
        id: 1,
        name: "Ibis Hotel & Convention Bali",
        roomType: "Business Suite Room for 2 Nights",
        location: "Bali",
      },
      {
        id: 2,
        name: "Sheraton Bali",
        roomType: "Deluxe Ocean View for 3 Nights",
        location: "Bali",
      },
      {
        id: 3,
        name: "JW Marriott Bali",
        roomType: "Premium Room for 2 Nights",
        location: "Bali",
      },
    ],
  },
  {
    id: 2,
    code: "TWIN20",
    title: "9.9 Twin Date | 20% OFF!",
    description: "Special twin date promotion with 20% discount",
    hotels: [
      {
        id: 4,
        name: "Atria Hotel Bali",
        roomType: "Twin Room for 2 Nights",
        location: "Bali",
      },
      {
        id: 5,
        name: "Grand Hyatt Jakarta",
        roomType: "Twin Deluxe Room for 3 Nights",
        location: "Jakarta",
      },
    ],
  },
  {
    id: 3,
    code: "INDEPENDENCE",
    title: "Independence Day | Free Upgrade to Suite Room",
    description: "Celebrate independence with free room upgrades",
    hotels: [
      {
        id: 6,
        name: "Shangri-La Surabaya",
        roomType: "Executive Suite for 2 Nights",
        location: "Surabaya",
      },
      {
        id: 7,
        name: "The Ritz-Carlton Jakarta",
        roomType: "Club Level Suite for 3 Nights",
        location: "Jakarta",
      },
    ],
  },
  {
    id: 4,
    code: "SEPTEMBER500",
    title: "September Promo | 500,000 IDR OFF!",
    description: "Massive savings this September",
    hotels: [
      {
        id: 8,
        name: "Conrad Bali",
        roomType: "Ocean View Suite for 4 Nights",
        location: "Bali",
      },
      {
        id: 9,
        name: "Four Seasons Jakarta",
        roomType: "Premier Room for 2 Nights",
        location: "Jakarta",
      },
    ],
  },
];

const PromoButton = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPromo, setSelectedPromo] = useQueryState(
    "promo",
    parseAsString,
  );

  // Filter promos based on search term
  const filteredPromos = promoData?.filter(
    (promo) =>
      promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePromoSelect = (promoCode: string) => {
    setSelectedPromo(promoCode);
    setOpen(false);
    toast.success("Promo applied!", {
      description: `Promo code ${promoCode} has been applied to your search.`,
      duration: 3000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CirclePercent className="mr-2 h-4 w-4" />
          Find Your Promo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto bg-white sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Find Your Promo
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search promo code here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Promo Accordion List */}
          <div className="space-y-2">
            {filteredPromos.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredPromos.map((promo) => (
                  <AccordionItem key={promo.id} value={`promo-${promo.id}`}>
                    <div className="flex items-center justify-between py-4">
                      <AccordionTrigger className="flex-1 text-left hover:no-underline">
                        <div className="mr-2 flex flex-col items-start">
                          <h3 className="text-lg font-semibold">
                            {promo.title}
                          </h3>
                        </div>
                      </AccordionTrigger>
                      <Button
                        size="sm"
                        onClick={() => handlePromoSelect(promo.code)}
                        className="ml-4 shrink-0"
                        disabled={selectedPromo === promo.code}
                      >
                        {selectedPromo === promo.code ? "Selected" : "Select"}
                      </Button>
                    </div>
                    <AccordionContent>
                      {/* Hotels in this promo */}
                      <div className="space-y-1">
                        {promo.hotels.map((hotel) => (
                          <h5
                            key={`${promo.id}-${hotel.id}`}
                            className="text-muted-foreground"
                          >
                            {hotel.name}
                          </h5>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <CirclePercent className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p className="text-lg font-medium">No promos found</p>
                <p className="text-sm">
                  Try searching with different keywords.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchFilter;
