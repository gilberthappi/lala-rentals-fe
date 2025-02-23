/* eslint-disable @next/next/no-img-element */
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
import { Button } from "@/components/ui/button";
import { FaShower } from "react-icons/fa";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

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
  const { data: session } = useSession();

  const [property, setProperty] = useState<IProperty | null>(null);
  // Store Date objects for the date pickers
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
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
    setMessage(null);

    if (!checkInDate || !checkOutDate) {
      setMessage({ type: "error", text: "Please select both check-in and check-out dates." });
      return;
    }

    if (checkInDate.getTime() === checkOutDate.getTime()) {
      setMessage({ type: "error", text: "Check-out date cannot be the same as check-in date." });
      return;
    }

    if (isDateRangeBooked(checkInDate, checkOutDate)) {
      setMessage({ type: "error", text: "Selected dates are already booked. Please choose different dates." });
      return;
    }

    setLoading(true);
    try {
      const userId = session?.user?.id;

      if (!userId) {
        setMessage({ type: "error", text: "User is not authenticated. Redirecting to sign-in page..." });
        setLoading(false);
        signIn();
        return;
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/booking`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            propertyId: id,
            checkInDate: checkInDate.toISOString(),
            checkOutDate: checkOutDate.toISOString(),
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Booking successful!" });
        setCheckInDate(null);
        setCheckOutDate(null);
        // Optionally update local bookings state here.
      } else {
        setMessage({ type: "error", text: data.message || "Booking failed." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
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
            <div className="w-full relative flex flex-col gap-4">
              <div className="w-full relative">
                <div className="flex flex-col items-center gap-[10px] w-full">
                  <div className="w-full h-[350px] flex items-center justify-center bg-[#f0f0f0] shadow-lg">
                    <img
                      src={property?.thumbnail || "/default-thumbnail.jpg"}
                      alt="Active Image"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex flex-row gap-[10px] p-[10px] justify-center w-full max-w-600px overflow-x-auto border p-2 rounded">
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
                        <img
                          src={property.thumbnail}
                          alt="Thumbnail"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full relative border border-slate-500 py-3 px-6 rounded">
                <h2 className="text-[2rem] truncate font-bold text-primary mb-[1rem]">
                  {property?.title}
                </h2> 
                <div className="flex flex-row justify-between mt-2 text-gray-900">
                 <div className="flex items-center w-1/2 gap-2">
                    <LocateIcon className="h-5 w-5" /> {property?.location}
                  </div>
                  <div className="flex items-center w-1/2 gap-2">
                    <HiOutlineCurrencyDollar className="h-5 w-5" /> {property?.pricePerNight} /night
                  </div>
                  </div>
                <div className="flex flex-row justify-between mt-2 text-gray-900 mb-4">
                  <div className="flex items-center w-1/2 gap-2">
                    <BedIcon className="h-5 w-5" /> {property?.bedrooms} bedrooms
                  </div>
                  <div className="flex items-center w-1/2 gap-2">
                    <FaShower className="h-5 w-5" /> {property?.bathrooms} bathrooms
                  </div>
                </div>
                <hr className="mb-2"/>
                <p className="font-regular text-[1rem]">
                  {property?.description.replace(/<\/?[^>]+(>|$)/g, "")}
                </p>
                <hr className="mb-2"/>
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
                  minDate={checkInDate ? new Date(checkInDate.getTime() + 86400000) : new Date()}
                  filterDate={(date) => {
                    if (!checkInDate) return true;
                    return !isDateRangeBooked(checkInDate, date);
                  }}
                  placeholderText="Select check-out date"
                  className="w-full p-2 border rounded mb-3"
                />
                <Button
                  type="submit"
                  className="w-full inline-block bg-yellow-600 text-white mt-2"
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Book Now"}
                </Button>
                {message && (
                  <p className={`text-center mt-3 ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
                    {message.text}
                  </p>
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
