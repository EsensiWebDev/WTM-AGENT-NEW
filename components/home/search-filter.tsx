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
  RotateCcw,
  Search,
  Users,
} from "lucide-react";

import { getPromos } from "@/app/(protected)/home/fetch";
import { fetchListProvince } from "@/server/general";
import { useQuery } from "@tanstack/react-query";
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
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);

  const [province, setProvince] = useQueryState(
    "province",
    parseAsString.withOptions({ shallow: false }),
  );
  const [{ from, to }, setDateRange] = useQueryStates({
    from: dateRangeParser.withDefault(tomorrow).withOptions({ shallow: false }),
    to: dateRangeParser.withDefault(dayAfterTomorrow).withOptions({ shallow: false }),
  });
  const [room, setRoom] = useQueryState(
    "total_rooms",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [promo, setPromo] = useQueryState(
    "promo_id",
    parseAsString.withOptions({ shallow: false }),
  );

  const [adult] = useQueryState(
    "total_adults",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [children] = useQueryState(
    "total_children",
    parseAsInteger.withDefault(0).withOptions({ shallow: false }),
  );

  // Check if any filter has been changed from default
  const hasActiveFilters = React.useMemo(() => {
    const isProvinceChanged = province !== null;
    const isDateChanged =
      format(from, "yyyy-MM-dd") !== format(tomorrow, "yyyy-MM-dd") ||
      format(to, "yyyy-MM-dd") !== format(dayAfterTomorrow, "yyyy-MM-dd");
    const isRoomChanged = room !== 1;
    const isPromoChanged = promo !== null;
    const isAdultChanged = adult !== 1;
    const isChildrenChanged = children !== 0;

    return (
      isProvinceChanged ||
      isDateChanged ||
      isRoomChanged ||
      isPromoChanged ||
      isAdultChanged ||
      isChildrenChanged
    );
  }, [province, from, to, room, promo, adult, children, tomorrow, dayAfterTomorrow]);

  const [, setAdult] = useQueryState(
    "total_adults",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [, setChildren] = useQueryState(
    "total_children",
    parseAsInteger.withDefault(0).withOptions({ shallow: false }),
  );

  const handleReset = () => {
    setProvince(null);
    setDateRange({ from: tomorrow, to: dayAfterTomorrow });
    setRoom(1);
    setPromo(null);
    setAdult(1);
    setChildren(0);
    toast.success("Filters reset", {
      description: "All search filters have been reset to default values.",
      duration: 3000,
    });
  };

  return (
    <section className="mb-0 py-2 sm:py-4">
      <div className="mx-auto rounded border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm sm:p-4">
        <div className="flex flex-col gap-2 md:flex-row">
          <LocationSelector provinces={provinces} />
          <DateRangePicker />
          <GuestCounter />
          <PromoButton from={from} to={to} />
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2 bg-gray-200"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
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
          className={"w-full justify-between bg-gray-200 md:flex-1"}
        >
          <div className={"flex items-center gap-2 overflow-hidden"}>
            <MapPin className={"h-4 w-4 flex-shrink-0"} />
            <span className="truncate">
              {value
                ? provinces.find((place) => place.value === value)?.label
                : "Choose your destination"}
            </span>
          </div>
          <ChevronDown className={"h-4 w-4 flex-shrink-0 opacity-50"} />
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
  // Set today to start of day (midnight) for accurate comparison
  today.setHours(0, 0, 0, 0);
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);

  const [{ from, to }, setDateRange] = useQueryStates({
    from: dateRangeParser.withDefault(tomorrow).withOptions({ shallow: false }),
    to: dateRangeParser.withDefault(dayAfterTomorrow).withOptions({ shallow: false }),
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start bg-gray-200 text-left font-normal md:flex-1",
            !from && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {from && to ? (
              <span className="hidden sm:inline">
                {`${format(from, "MMM d, yyyy")} - ${format(to, "MMM d, yyyy")}`}
              </span>
            ) : (
              <span>Select Period</span>
            )}
            {from && to && (
              <span className="sm:hidden">
                {`${format(from, "MMM d")} - ${format(to, "MMM d")}`}
              </span>
            )}
          </span>
          <ChevronsUpDown className="ml-auto flex-shrink-0 opacity-50" />
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
          disabled={(date) => {
            // Disable dates before tomorrow (users can't book for today)
            return date < tomorrow;
          }}
          className="rounded-lg border shadow-sm"
        />
      </PopoverContent>
    </Popover>
  );
};

const GuestCounter = () => {
  const [room, setRoom] = useQueryState(
    "total_rooms",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [adult, setAdult] = useQueryState(
    "total_adults",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [children, setChildren] = useQueryState(
    "total_children",
    parseAsInteger.withDefault(0).withOptions({ shallow: false }),
  );

  const MAX_ADULTS_PER_ROOM = 99;

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
          className={"w-full justify-between bg-gray-200 md:flex-1"}
        >
          <div className={"flex items-center gap-2 overflow-hidden"}>
            <Users className={"h-4 w-4 flex-shrink-0"} />
            <span className="truncate text-sm sm:text-base">
              <span className="hidden sm:inline">
                {adult} Adult(s), {children} Child, {room} Room
              </span>
              <span className="sm:hidden">
                {adult}A, {children}C, {room}R
              </span>
            </span>
          </div>
          <ChevronDown className={"h-4 w-4 flex-shrink-0 opacity-50"} />
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

const PromoButton = ({ from, to }: { from: Date; to: Date }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPromo, setSelectedPromo] = useQueryState(
    "promo_id",
    parseAsString.withOptions({ shallow: false }),
  );

  // Calculate number of nights from selected dates
  const calculateNights = React.useMemo(() => {
    if (!from || !to) return 0;
    const timeDiff = Math.abs(to.getTime() - from.getTime());
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }, [from, to]);

  const {
    data: promosData,
    isLoading: isLoadingPromos,
    isError: isErrorPromos,
  } = useQuery({
    queryKey: ["promo-home-page"],
    queryFn: () => getPromos({ searchParams: { limit: "0" } }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    enabled: open || !!selectedPromo, // Fetch when dialog is open OR when a promo is selected
  });

  // Find the selected promo object
  const selectedPromoData = React.useMemo(() => {
    if (!selectedPromo || !promosData?.data) return null;
    return promosData.data.find((promo) => String(promo.id) === selectedPromo);
  }, [selectedPromo, promosData]);

  // Filter promos based on search term
  const filteredPromos =
    promosData?.data?.filter(
      (promo) =>
        promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.description.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  // Check if a promo is valid for the selected stay duration
  const isPromoValid = React.useCallback((promo: { total_nights?: number }) => {
    // If promo doesn't have total_nights requirement, it's always valid
    if (!promo.total_nights) return true;
    
    // If dates are not selected, we can't validate
    if (!from || !to) return true;
    
    // Promo is valid if user's stay duration matches the promo's required nights
    return calculateNights === promo.total_nights;
  }, [from, to, calculateNights]);

  const handlePromoSelect = (promoCode: string, promo: { total_nights?: number; name: string }) => {
    // Validate before selecting
    if (!isPromoValid(promo)) {
      const requiredNights = promo.total_nights ?? 0;
      toast.error("Promo not applicable", {
        description: `This promo requires ${requiredNights} night${requiredNights > 1 ? 's' : ''} stay, but you selected ${calculateNights} night${calculateNights !== 1 ? 's' : ''}.`,
        duration: 5000,
      });
      return;
    }

    setSelectedPromo(promoCode);
    setOpen(false);
    toast.success("Promo applied!", {
      description: `Promo has been applied to your search.`,
      duration: 3000,
    });
  };

  // Determine button label based on selected promo
  const getButtonLabel = () => {
    if (selectedPromoData) {
      // Truncate promo name on mobile if too long
      const displayName = selectedPromoData.name.length > 15 
        ? `${selectedPromoData.name.substring(0, 15)}...`
        : selectedPromoData.name;
      
      return (
        <>
          <span className="hidden sm:inline">Promo: {selectedPromoData.name}</span>
          <span className="sm:hidden">Promo: {displayName}</span>
        </>
      );
    }
    return (
      <>
        <span className="hidden sm:inline">Find Your Promo</span>
        <span className="sm:hidden">Promo</span>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CirclePercent className="mr-2 h-4 w-4 flex-shrink-0" />
          {getButtonLabel()}
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
            {isLoadingPromos ? (
              <div className="py-8 text-center text-gray-500">
                <p className="text-lg font-medium">Loading promos...</p>
              </div>
            ) : isErrorPromos ? (
              <div className="py-8 text-center text-gray-500">
                <CirclePercent className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p className="text-lg font-medium">Error loading promos</p>
                <p className="text-sm">Please try again later.</p>
              </div>
            ) : filteredPromos.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredPromos.map((promo) => (
                  <AccordionItem key={promo.id} value={`promo-${promo.id}`}>
                    <div className="flex items-center justify-between py-4">
                      <AccordionTrigger className="flex-1 text-left hover:no-underline">
                        <div className="mr-2 flex flex-col items-start">
                          <h3 className="text-lg font-semibold">
                            {promo.name}
                          </h3>
                        </div>
                      </AccordionTrigger>
                      <Button
                        size="sm"
                        onClick={() => handlePromoSelect(String(promo.id), promo)}
                        className="ml-4 shrink-0"
                        disabled={
                          selectedPromo === String(promo.id) || !isPromoValid(promo)
                        }
                        title={
                          !isPromoValid(promo) && promo.total_nights
                            ? `This promo requires ${promo.total_nights} night${promo.total_nights > 1 ? 's' : ''} stay`
                            : undefined
                        }
                      >
                        {selectedPromo === String(promo.id)
                          ? "Selected"
                          : !isPromoValid(promo)
                            ? "Not Valid"
                            : "Select"}
                      </Button>
                    </div>
                    <AccordionContent>
                      {/* Promo details */}
                      <div className="space-y-2">
                        {promo.description && (
                          <p className="text-sm text-gray-700">{promo.description}</p>
                        )}
                        {promo.total_nights && (
                          <p className="text-xs text-gray-500">
                            Requires {promo.total_nights} night{promo.total_nights > 1 ? 's' : ''} stay
                            {!isPromoValid(promo) && from && to && (
                              <span className="ml-2 text-red-600">
                                (Your stay: {calculateNights} night{calculateNights !== 1 ? 's' : ''})
                              </span>
                            )}
                          </p>
                        )}
                        {/* Hotels in this promo */}
                        <div className="space-y-1 mt-2">
                          <p className="text-xs font-semibold text-gray-600">Available at:</p>
                          {promo.hotel.map((hotelName, index) => (
                            <h5
                              key={`${promo.id}-${index}`}
                              className="text-muted-foreground text-sm"
                            >
                              {hotelName}
                            </h5>
                          ))}
                        </div>
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
