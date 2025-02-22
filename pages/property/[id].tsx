import React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/footer/Footer";
import "../../app/globals.css";
import { BedIcon, LocateIcon } from "lucide-react";
import Link from "next/link";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getProperty } from "@/services/property";
import type { IProperty, IBookings } from "@/types/index";
import Loader from "@/components/ui/Loader";
import Image from "next/image";
interface IBookedInterval {
  start: Date;
  end: Date;
}

const normalizeDate = (date: string | Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const PropertyPage = () => {
  const router = useRouter();
  const { id } = router.query;

  
  const [property, setProperty] = useState<IProperty | null>(null);
  // Store Date objects for the date pickers
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        try {
          const foundProperty = await getProperty(id as string);
          setProperty(foundProperty);
        } catch (error) {
          console.error("Failed to fetch property details:", error);
          setProperty(null);
        }
      };
      fetchProperty();
    }
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((prevIndex) =>
        prevIndex === (property?.gallery?.length ?? 0) - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [property?.gallery]);

  // Build booked intervals (normalized to disable full days)
  const bookedIntervals =
    property?.bookings?.map((booking) => ({
      start: normalizeDate(booking.checkInDate),
      end: normalizeDate(booking.checkOutDate),
    })) || [];

  // Helper to determine if a given date falls within any booked interval.
  const isDateDisabled = (date: Date): boolean => {
    const normalized = normalizeDate(date);
    return bookedIntervals.some(
      (interval: IBookedInterval) => normalized >= interval.start && normalized <= interval.end
    );
  };


  const isDateRangeBooked = (start: Date, end: Date): boolean => {
    if (!property?.bookings) return false;
    const normalizedStart = normalizeDate(start);
    const normalizedEnd = normalizeDate(end);
    return property.bookings.some((booking: IBookings) => {
      const bookedStart = normalizeDate(booking.checkInDate);
      const bookedEnd = normalizeDate(booking.checkOutDate);
      return normalizedStart < bookedEnd && normalizedEnd > bookedStart;
    });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!checkInDate || !checkOutDate) {
      setMessage("Please select both check-in and check-out dates.");
      return;
    }

    if (isDateRangeBooked(checkInDate, checkOutDate)) {
      setMessage(
        "Selected dates are already booked. Please choose different dates."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/booking`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId: id,
            checkInDate: checkInDate.toISOString(),
            checkOutDate: checkOutDate.toISOString(),
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Booking successful!");
        // Optionally update local bookings state here.
      } else {
        setMessage(data.message || "Booking failed.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      <Header />

      <div className="w-[95%] m-auto pt-10 pb-10 relative">
        {loading ? (
          <Loader />
        ) : (
          <div className="w-full relative flex flex-col lg:flex-row items-start py-8 gap-[1rem]">
            <div className="w-full relative flex flex-col gap-[3rem]">
              <div className="w-full relative">
                <div className="flex flex-col items-center gap-[10px] w-full">
                  <div className="w-full h-[350px] flex items-center justify-center bg-[#f0f0f0] shadow-lg">
                    <Image
                      src={property?.thumbnail || "/default-thumbnail.jpg"}
                      alt="Active Image"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="flex flex-row gap-[10px] p-[10px] justify-center w-full max-w-600px overflow-x-auto">
                    {property?.gallery.map((image, index) => (
                      <div
                        key={index}
                        className={`w-[80px] h-[80px] cursor-pointer rounded transition ${
                          activeImageIndex === index
                            ? "border-2 border-primary"
                            : ""
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={property.thumbnail}
                          alt="Thumbnail"
                          layout="fill"
                          objectFit="cover"
                          className="rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full relative">
                <h2 className="text-[2rem] truncate font-bold text-primary mb-[1rem]">
                  {property?.title}
                </h2>
                <div className="flex flex-row gap-3 items-center mt-2 text-gray-900">
                  <div className="flex items-center gap-2">
                    <BedIcon className="h-5 w-5" /> {property?.bedrooms} Bedrooms
                  </div>
                  <div className="flex items-center gap-2">
                    <BedIcon className="h-5 w-5" /> {property?.bathrooms} Bathrooms
                  </div>
                  <div className="flex items-center gap-2">
                    <LocateIcon className="h-5 w-5" /> {property?.location}
                  </div>
                </div>
                <p className="font-regular text-[1rem]">
                  {property?.description.replace(/<\/?[^>]+(>|$)/g, "")}
                </p>
                <div className="my-3 w-fit border border-slate-500 py-3 px-6 rounded">
                  <p className="text-[1rem] font-medium">
                    <span className="font-regular">Hosted by:</span>{" "}
                    {property?.user.lastName} {property?.user.firstName}
                  </p>
                  <Link href={`mailto:${property?.user.email}`}>
                    {property?.user.email}
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full lg:min-w-[400px] sticky top-[7rem]">
              <form
                className="bg-white shadow-md p-6 rounded-lg w-full"
                onSubmit={handleBooking}
              >
                <h3 className="text-xl font-bold mb-4">Book Form</h3>
                <label className="block text-sm font-semibold mb-1">
                  Check-in Date:
                </label>
                <ReactDatePicker
                  selected={checkInDate}
                  onChange={(date) => {
                    setCheckInDate(date);
                    setCheckOutDate(null);
                  }}
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  filterDate={(date) => !isDateDisabled(date)}
                  placeholderText="Select check-in date"
                  className="w-full p-2 border rounded mb-3"
                />

                <label className="block text-sm font-semibold mb-1">
                  Check-out Date:
                </label>
                <ReactDatePicker
                  selected={checkOutDate}
                  onChange={(date) => setCheckOutDate(date)}
                  dateFormat="yyyy-MM-dd"
                  minDate={checkInDate || new Date()}
                  filterDate={(date) => {
                    if (!checkInDate) return true;
                    return !isDateRangeBooked(checkInDate, date);
                  }}
                  placeholderText="Select check-out date"
                  className="w-full p-2 border rounded mb-3"
                />

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-opacity-90 transition"
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Book Now"}
                </button>
                {message && (
                  <p className="text-center text-red-500 mt-3">{message}</p>
                )}
              </form>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PropertyPage;
